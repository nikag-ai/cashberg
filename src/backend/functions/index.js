const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

// Note: In a real project, we would condition this init, 
// but for the Agent's simulation we assume standard setup.
if (admin.apps.length === 0) {
    admin.initializeApp();
}

/**
 * Helper to enforce integer math (Cents)
 */
const toCents = (amount) => Math.round(amount * 100);
const toDollars = (cents) => cents / 100;

/**
 * 0. Initialize Iceberg (Cold Start)
 */
exports.initializeLedger = onCall(async (request) => {
    try {
        console.log("DEBUG_V2: call start");
        if (!request.auth) {
            console.log("DEBUG_V2: Auth Missing");
            throw new HttpsError('unauthenticated', 'Login required');
        }

        const uid = request.auth.uid;
        const data = request.data;
        console.log("DEBUG_V2: Payload received", JSON.stringify(data));

        // Validation
        if (data.totalBalanceCents === undefined || data.safeTipCents === undefined) {
            throw new HttpsError('invalid-argument', 'Missing totalBalanceCents or safeTipCents');
        }

        const totalInput = data.totalBalanceCents;
        const tipInput = data.safeTipCents;

        const db = admin.firestore();
        const ledgerRef = db.doc(`users/${uid}/ledgers/main`);

        return await db.runTransaction(async (t) => {
            const doc = await t.get(ledgerRef);
            if (doc.exists) throw new HttpsError('already-exists', 'Iceberg already exists');

            const frozen = totalInput - tipInput;
            console.log("DEBUG_V2: Calculated frozen", frozen);

            // 1. Create Ledger
            t.set(ledgerRef, {
                totalMass: totalInput,
                safeTip: tipInput,
                frozenMass: frozen,
                status: 'stable',
                status: 'stable',
                createdAt: FieldValue.serverTimestamp() // FIXED
            });

            // 1.5 Create Genesis Transaction (So Stream isn't empty)
            const genesisTxnRef = ledgerRef.collection('transactions').doc();
            t.set(genesisTxnRef, {
                amount: totalInput,
                type: 'CREDIT',
                category: 'Calibration',
                description: 'Initial Balance',
                timestamp: FieldValue.serverTimestamp()
            });

            // 2. Create Default Savings Bucket
            if (frozen > 0) {
                const bucketRef = db.doc(`users/${uid}/buckets/general_savings`);
                t.set(bucketRef, {
                    name: 'General Savings',
                    type: 'GHOST',
                    targetAmount: 0,
                    currentAmount: frozen,
                    isFilled: true
                });
            }
        });
    } catch (e) {
        console.error("DEBUG_V2: CRASH", e);
        throw e;
    }
});

/**
 * 1. Melt Iceberg (Spend) (v2)
 */
exports.meltIceberg = onCall(async (request) => {
    try {
        if (!request.auth) throw new HttpsError('unauthenticated', 'Login required');

        const uid = request.auth.uid;
        const data = request.data;
        const amountCents = toCents(data.amount);

        if (amountCents <= 0) {
            throw new HttpsError('invalid-argument', 'Amount must be positive');
        }

        const db = admin.firestore();
        const ledgerRef = db.doc(`users/${uid}/ledgers/main`);

        return await db.runTransaction(async (t) => {
            const doc = await t.get(ledgerRef);
            if (!doc.exists) throw new HttpsError('not-found', 'Iceberg not found');

            const currentData = doc.data();
            const currentTip = currentData.safeTip || 0;
            const currentTotal = currentData.totalMass || 0;

            const newTip = currentTip - amountCents;
            const newTotal = currentTotal - amountCents;
            const status = newTip < 0 ? 'fractured' : 'stable';

            t.update(ledgerRef, {
                safeTip: newTip,
                totalMass: newTotal,
                status: status,
                updatedAt: FieldValue.serverTimestamp() // FIXED
            });

            const txnRef = ledgerRef.collection('transactions').doc();
            t.set(txnRef, {
                amount: amountCents,
                type: 'DEBIT',
                category: data.category || 'General',
                description: data.description || 'Quick Melt',
                timestamp: FieldValue.serverTimestamp() // FIXED
            });

            return { newTip: toDollars(newTip), status };
        });
    } catch (e) {
        console.error("DEBUG_V2: MELT CRASH", e);
        throw e;
    }
});

/**
 * 2. Process Payday (Income) (v2)
 */
exports.processPayday = onCall(async (request) => {
    try {
        if (!request.auth) throw new HttpsError('unauthenticated', 'Login required');

        const uid = request.auth.uid;
        const data = request.data;
        const incomeCents = toCents(data.amount);
        const db = admin.firestore();
        const ledgerRef = db.doc(`users/${uid}/ledgers/main`);

        return await db.runTransaction(async (t) => {
            const ledgerDoc = await t.get(ledgerRef);
            if (!ledgerDoc.exists) throw new HttpsError('not-found', 'Iceberg not found');

            const bucketsSnapshot = await t.get(
                db.collection(`users/${uid}/buckets`)
                    .where('type', '==', 'BILL')
                    .where('isFilled', '==', false)
                    .orderBy('dueDate', 'asc')
            );

            let remainingIncome = incomeCents;
            const bucketUpdates = [];

            bucketsSnapshot.forEach(doc => {
                if (remainingIncome <= 0) return;
                const b = doc.data();
                const needed = (b.targetAmount || 0) - (b.currentAmount || 0);

                if (needed > 0) {
                    const allocation = Math.min(remainingIncome, needed);
                    remainingIncome -= allocation;
                    const newCurrent = (b.currentAmount || 0) + allocation;
                    bucketUpdates.push({
                        ref: doc.ref,
                        update: {
                            currentAmount: newCurrent,
                            isFilled: newCurrent >= b.targetAmount
                        }
                    });
                }
            });

            bucketUpdates.forEach(b => {
                t.update(b.ref, b.update);
            });

            const allocated = incomeCents - remainingIncome;

            t.update(ledgerRef, {
                totalMass: FieldValue.increment(incomeCents), // FIXED
                safeTip: FieldValue.increment(remainingIncome), // FIXED
                frozenMass: FieldValue.increment(allocated), // FIXED
                updatedAt: FieldValue.serverTimestamp() // FIXED
            });

            const txnRef = ledgerRef.collection('transactions').doc();
            t.set(txnRef, {
                amount: incomeCents,
                allocatedToBills: allocated,
                type: 'CREDIT',
                category: 'Payday',
                timestamp: FieldValue.serverTimestamp() // FIXED
            });

            return {
                addedToTip: toDollars(remainingIncome),
                paidToBills: toDollars(allocated)
            };
        });
    } catch (e) {
        console.error("DEBUG_V2: PAYDAY CRASH", e);
        throw e;
    }
});

/**
 * 3. Transfer Funds (Freeze/Thaw)
 * Moves money between Tip and a specific Bucket.
 */
exports.transferFunds = onCall(async (request) => {
    try {
        if (!request.auth) throw new HttpsError('unauthenticated', 'Login required');

        const { bucketId, amount, type } = request.data; // type: 'FREEZE' (Tip -> Bucket) or 'THAW' (Bucket -> Tip)
        const amountCents = toCents(amount);
        const uid = request.auth.uid;
        const db = admin.firestore();

        const ledgerRef = db.doc(`users/${uid}/ledgers/main`);
        const bucketRef = db.doc(`users/${uid}/buckets/${bucketId}`);

        return await db.runTransaction(async (t) => {
            const ledgerDoc = await t.get(ledgerRef);
            const bucketDoc = await t.get(bucketRef);

            if (!ledgerDoc.exists) throw new HttpsError('not-found', 'Ledger not found');
            if (!bucketDoc.exists) throw new HttpsError('not-found', 'Bucket not found');

            const ledger = ledgerDoc.data();
            const bucket = bucketDoc.data();

            if (type === 'FREEZE') {
                // Check if Tip has enough
                if ((ledger.safeTip || 0) < amountCents) {
                    throw new HttpsError('failed-precondition', 'Not enough Safe Tip to freeze');
                }

                // Move: Tip -> Bucket
                t.update(ledgerRef, {
                    safeTip: FieldValue.increment(-amountCents),
                    frozenMass: FieldValue.increment(amountCents),
                    updatedAt: FieldValue.serverTimestamp()
                });
                t.update(bucketRef, {
                    currentAmount: FieldValue.increment(amountCents),
                    isFilled: (bucket.currentAmount + amountCents) >= bucket.targetAmount
                });

            } else if (type === 'THAW') {
                // Check if Bucket has enough
                if ((bucket.currentAmount || 0) < amountCents) {
                    throw new HttpsError('failed-precondition', 'Not enough in bucket to thaw');
                }

                // Move: Bucket -> Tip
                t.update(ledgerRef, {
                    safeTip: FieldValue.increment(amountCents),
                    frozenMass: FieldValue.increment(-amountCents),
                    updatedAt: FieldValue.serverTimestamp()
                });
                t.update(bucketRef, {
                    currentAmount: FieldValue.increment(-amountCents),
                    isFilled: (bucket.currentAmount - amountCents) >= bucket.targetAmount
                });
            } else {
                throw new HttpsError('invalid-argument', 'Invalid transfer type');
            }

            return { success: true };
        });

    } catch (e) {
        console.error("DEBUG_V2: TRANSFER CRASH", e);
        throw e;
    }
});

/**
 * 4. Create Bucket
 */
exports.createBucket = onCall(async (request) => {
    try {
        if (!request.auth) throw new HttpsError('unauthenticated', 'Login required');

        const { name, type, targetAmountCents } = request.data;
        const uid = request.auth.uid;
        const db = admin.firestore();

        const newBucketRef = db.collection(`users/${uid}/buckets`).doc();

        await newBucketRef.set({
            name,
            type: type || 'GOAL',
            targetAmount: targetAmountCents || 0,
            currentAmount: 0,
            isFilled: false,
            createdAt: FieldValue.serverTimestamp()
        });

        return { id: newBucketRef.id };

    } catch (e) {
        console.error("DEBUG_V2: CREATE BUCKET CRASH", e);
        throw e;
    }
});

/**
 * 5. Reconcile Ledger (The Repair)
 * Adjusts Total Mass to match Reality. Difference is applied to Tip.
 */
exports.reconcileLedger = onCall(async (request) => {
    try {
        if (!request.auth) throw new HttpsError('unauthenticated', 'Login required');

        const { actualBalanceCents } = request.data;
        const uid = request.auth.uid;
        const db = admin.firestore();
        const ledgerRef = db.doc(`users/${uid}/ledgers/main`);

        return await db.runTransaction(async (t) => {
            const doc = await t.get(ledgerRef);
            if (!doc.exists) throw new HttpsError('not-found', 'Ledger not found');

            const currentData = doc.data();
            const currentTotal = currentData.totalMass || 0;

            // Drift = Reality - System
            const drift = actualBalanceCents - currentTotal;

            if (drift === 0) {
                return { drift: "$0.00", status: "aligned" };
            }

            // Apply drift to Total and Tip
            // If Drift is positive (Found Money), Tip increases.
            // If Drift is negative (Lost Money), Tip decreases (can go negative/fracture).

            const newTotal = currentTotal + drift;
            const newTip = (currentData.safeTip || 0) + drift;
            const status = newTip < 0 ? 'fractured' : 'stable';

            t.update(ledgerRef, {
                totalMass: newTotal,
                safeTip: newTip,
                status: status,
                updatedAt: FieldValue.serverTimestamp()
            });

            // Audit
            const txnRef = ledgerRef.collection('transactions').doc();
            t.set(txnRef, {
                amount: Math.abs(drift),
                type: drift > 0 ? 'CREDIT' : 'DEBIT',
                category: 'Reconciliation',
                description: drift > 0 ? 'Found Money' : 'Leakage / Adjustment',
                timestamp: FieldValue.serverTimestamp()
            });

            return { drift: toDollars(drift), status };
        });

    } catch (e) {
        console.error("DEBUG_V2: RECONCILE CRASH", e);
        throw e;
    }
});

/**
 * 6. Undo Transaction
 * Reverses a transaction effects.
 * Currently supports: MELT (Debit), RECONCILE (Debit/Credit).
 * RESTRICTED: PAYDAY (Credit) - Cannot easily reverse bucket splits.
 */
exports.undoTransaction = onCall(async (request) => {
    try {
        if (!request.auth) throw new HttpsError('unauthenticated', 'Login required');

        const { transactionId } = request.data;
        const uid = request.auth.uid;
        const db = admin.firestore();
        const ledgerRef = db.doc(`users/${uid}/ledgers/main`);
        const txnRef = db.doc(`users/${uid}/ledgers/main/transactions/${transactionId}`);

        return await db.runTransaction(async (t) => {
            const txnDoc = await t.get(txnRef);
            if (!txnDoc.exists) throw new HttpsError('not-found', 'Transaction not found');

            const txn = txnDoc.data();

            // Safety Checks
            if (txn.category === 'Payday') {
                throw new HttpsError('failed-precondition', 'Cannot undo Payday transactions directly.');
            }
            if (txn.category === 'Void') {
                throw new HttpsError('failed-precondition', 'Transaction already voided.');
            }

            const ledgerDoc = await t.get(ledgerRef);
            if (!ledgerDoc.exists) throw new HttpsError('not-found', 'Ledger not found');
            const ledgerData = ledgerDoc.data();
            const currentTip = ledgerData.safeTip || 0;
            const currentTotal = ledgerData.totalMass || 0;

            // Reverse the effect
            // If DEBIT -> Add back to Tip/Total
            // If CREDIT -> Remove from Tip/Total

            const amount = txn.amount || 0;
            const reverseMultiplier = txn.type === 'DEBIT' ? 1 : -1;
            const reverseAmount = amount * reverseMultiplier;

            // Calculate New State Manually
            const newTip = currentTip + reverseAmount;
            const newTotal = currentTotal + reverseAmount;
            const newStatus = newTip < 0 ? 'fractured' : 'stable';

            // Update Ledger
            t.update(ledgerRef, {
                totalMass: newTotal,
                safeTip: newTip,
                status: newStatus,
                updatedAt: FieldValue.serverTimestamp()
            });

            // Delete to remove from history (User Request)
            t.delete(txnRef);

            return { success: true };
        });

    } catch (e) {
        console.error("DEBUG_V2: UNDO CRASH", e);
        throw e;
    }
});

/**
 * 7. Delete Bucket
 * Moves any funds back to Safe Tip (Unallocated) and deletes the bucket.
 */
exports.deleteBucket = onCall(async (request) => {
    try {
        if (!request.auth) throw new HttpsError('unauthenticated', 'Login required');

        const { bucketId } = request.data;
        const uid = request.auth.uid;
        const db = admin.firestore();

        const bucketRef = db.doc(`users/${uid}/buckets/${bucketId}`);
        const ledgerRef = db.doc(`users/${uid}/ledgers/main`);

        return await db.runTransaction(async (t) => {
            const bucketDoc = await t.get(bucketRef);
            if (!bucketDoc.exists) throw new HttpsError('not-found', 'Bucket not found');

            const bucket = bucketDoc.data();
            const fundsToReturn = bucket.currentAmount || 0;

            if (fundsToReturn > 0) {
                const ledgerDoc = await t.get(ledgerRef);
                if (!ledgerDoc.exists) throw new HttpsError('not-found', 'Ledger not found');

                // Return funds to Safe Tip (Unallocate) and Frozen Mass (Defrost)
                // Wait, if it's in a bucket, it's counted as Frozen Mass.
                // Moving back to Safe Tip means we reduce Frozen Mass and increase Safe Tip.
                t.update(ledgerRef, {
                    safeTip: FieldValue.increment(fundsToReturn),
                    frozenMass: FieldValue.increment(-fundsToReturn),
                    updatedAt: FieldValue.serverTimestamp()
                });
            }

            // Delete the bucket
            t.delete(bucketRef);

            return { success: true, fundsReturned: toDollars(fundsToReturn) };
        });

    } catch (e) {
        console.error("DEBUG_V2: DELETE BUCKET CRASH", e);
        throw e;
    }
});

/**
 * 8. Edit Bucket
 * Updates Name, Target Amount, and Recalculates 'isFilled'.
 */
exports.editBucket = onCall(async (request) => {
    try {
        if (!request.auth) throw new HttpsError('unauthenticated', 'Login required');

        const { bucketId, name, targetAmountCents } = request.data;
        const uid = request.auth.uid;
        const db = admin.firestore();

        const bucketRef = db.doc(`users/${uid}/buckets/${bucketId}`);

        return await db.runTransaction(async (t) => {
            const bucketDoc = await t.get(bucketRef);
            if (!bucketDoc.exists) throw new HttpsError('not-found', 'Bucket not found');

            const bucket = bucketDoc.data();
            const newName = name || bucket.name;
            const newTarget = targetAmountCents !== undefined ? targetAmountCents : bucket.targetAmount;
            const currentAmount = bucket.currentAmount || 0;

            t.update(bucketRef, {
                name: newName,
                targetAmount: newTarget,
                isFilled: currentAmount >= newTarget,
                updatedAt: FieldValue.serverTimestamp()
            });

            return { success: true };
        });

    } catch (e) {
        console.error("DEBUG_V2: EDIT BUCKET CRASH", e);
        throw e;
    }
});
