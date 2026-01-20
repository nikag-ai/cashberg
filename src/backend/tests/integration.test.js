import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions';
import { getFirestore, connectFirestoreEmulator, doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, signInWithCredential, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';

// Test Config (Connects to Emulator)
const firebaseConfig = {
    projectId: "cashberg-fc307",
    apiKey: "fake-api-key",
    authDomain: "cashberg-fc307.firebaseapp.com",
};

describe('Backend Integration (Emulators)', () => {
    let app, functions, db, auth, uid;

    beforeAll(async () => {
        app = initializeApp(firebaseConfig);

        // Connect to Emulators
        functions = getFunctions(app);
        connectFunctionsEmulator(functions, 'localhost', 5001);

        db = getFirestore(app);
        connectFirestoreEmulator(db, 'localhost', 8080);

        auth = getAuth(app);
        connectAuthEmulator(auth, 'http://127.0.0.1:9099');

        // Auth as a test user
        const userCred = await signInAnonymously(auth);
        uid = userCred.user.uid;
        console.log("Test User Signed In:", uid);

        // Ensure token is ready?
        await userCred.user.getIdToken(true);
    });

    it('should initialize a user ledger', async () => {
        const init = httpsCallable(functions, 'initializeLedger');

        await init({
            totalBalanceCents: 500000, // $5000.00
            safeTipCents: 50000        // $500.00
        });

        const docSnap = await getDoc(doc(db, `users/${uid}/ledgers/main`));
        expect(docSnap.exists()).toBe(true);
        expect(docSnap.data().totalMass).toBe(500000);
    });

    it('Melt: should reduce tip and log transaction via Cloud Function', async () => {
        const melt = httpsCallable(functions, 'meltIceberg');

        // Melt $15.50
        const result = await melt({ amount: 15.50, category: 'Food' });

        expect(result.data.status).toBe('stable');
        // Old Tip $500.00 - $15.50 = $484.50
        expect(result.data.newTip).toBe(484.5);

        // Verify DB State
        const ledgerSnap = await getDoc(doc(db, `users/${uid}/ledgers/main`));
        expect(ledgerSnap.data().safeTip).toBe(48450); // Cents
        expect(ledgerSnap.data().totalMass).toBe(498450); // Cents

        // Verify Audit Log
        const txnQuery = await getDocs(collection(db, `users/${uid}/ledgers/main/transactions`));
        expect(txnQuery.docs.length).toBeGreaterThan(0);
        const txn = txnQuery.docs.find(d => d.data().type === 'DEBIT');
        expect(txn.data().amount).toBe(1550);
    });

    it('Payday: should auto-sort income to bills first', async () => {
        // ... existing test ...
        // 1. Setup: Create an unfilled Bill bucket
        // Target: $100.00. Current: $0.
        await setDoc(doc(db, `users/${uid}/buckets/bill_1`), {
            name: 'Internet',
            type: 'BILL',
            targetAmount: 10000, // $100.00
            currentAmount: 0,
            isFilled: false,
            dueDate: '2025-01-01'
        });

        // 2. Call Payday Function (Income $150.00)
        const payday = httpsCallable(functions, 'processPayday');
        const result = await payday({ amount: 150.00 });

        // 3. Verify Response
        // $100 goes to Bill, $50 goes to Tip.
        expect(result.data.paidToBills).toBe(100);
        expect(result.data.addedToTip).toBe(50);

        // 4. Verify DB State

        // Bucket should be full
        const bucketSnap = await getDoc(doc(db, `users/${uid}/buckets/bill_1`));
        expect(bucketSnap.data().currentAmount).toBe(10000);
        expect(bucketSnap.data().isFilled).toBe(true);

        // Ledger Tip should have increased by $50 (484.50 + 50 = 534.50)
        const ledgerSnap = await getDoc(doc(db, `users/${uid}/ledgers/main`));
        expect(ledgerSnap.data().safeTip).toBe(53450);
    });

    it('Buckets: should create bucket and Freeze/Thaw funds', async () => {
        const create = httpsCallable(functions, 'createBucket');
        const transfer = httpsCallable(functions, 'transferFunds');

        // 1. Create a Goal Bucket (Target $50)
        const createRes = await create({
            name: 'New Bike',
            type: 'GOAL',
            targetAmountCents: 5000
        });
        const bucketId = createRes.data.id;
        expect(bucketId).toBeDefined();

        // 2. Freeze $20 (Tip -> Bucket)
        // Current Tip is ~534.50 (from previous test)
        await transfer({ bucketId, amount: 20.00, type: 'FREEZE' });

        const bucketSnap = await getDoc(doc(db, `users/${uid}/buckets/${bucketId}`));
        expect(bucketSnap.data().currentAmount).toBe(2000); // 2000 cents

        const ledgerSnap = await getDoc(doc(db, `users/${uid}/ledgers/main`));
        // Tip should decrease by 2000
        // Frozen Mass should increase by 2000
        expect(ledgerSnap.data().safeTip).toBe(51450); // 53450 - 2000

        // 3. Thaw $10 (Bucket -> Tip)
        await transfer({ bucketId, amount: 10.00, type: 'THAW' });

        const bucketSnap2 = await getDoc(doc(db, `users/${uid}/buckets/${bucketId}`));
        expect(bucketSnap2.data().currentAmount).toBe(1000); // 1000 cents remains

        const ledgerSnap2 = await getDoc(doc(db, `users/${uid}/ledgers/main`));
        expect(ledgerSnap2.data().safeTip).toBe(52450); // 51450 + 1000
    });

    it('Reconcile: should adjust tip when balance drifts', async () => {
        const reconcile = httpsCallable(functions, 'reconcileLedger');

        // Current State from previous tests:
        // Start: $5000.00
        // Melt: -$15.50 -> $4984.50
        // Payday: +$150.00 -> $5134.50
        // Freeze/Thaw: Net 0 change to Total.

        // User Inputs Actual: $5200.00
        // Drift = 5200.00 - 5134.50 = +65.50

        const result = await reconcile({ actualBalanceCents: 520000 });

        expect(result.data.drift).toBe(65.5); // $65.50
        expect(result.data.status).toBe('stable');

        const ledgerSnap = await getDoc(doc(db, `users/${uid}/ledgers/main`));
        // Total should match reality
        expect(ledgerSnap.data().totalMass).toBe(520000);
        // Tip should match old tip + drift
        // Old Tip (from Buckets test): 52450 ($524.50)
        // New Tip = 524.50 + 65.50 = 590.00 (59000)
        expect(ledgerSnap.data().safeTip).toBe(59000);
    });

    it('Undo: should reverse a melt transaction', async () => {
        const melt = httpsCallable(functions, 'meltIceberg');
        const undo = httpsCallable(functions, 'undoTransaction');

        // 1. Melt $20
        const meltRes = await melt({ amount: 20.00, category: 'Mistake' });
        // Old Tip (from previous test): 59000 ($590.00)
        // New Tip = 57000 ($570.00)
        expect(meltRes.data.newTip).toBe(570.0);

        // Verify Txn Exists
        const querySnap = await getDocs(collection(db, `users/${uid}/ledgers/main/transactions`));
        const txnDoc = querySnap.docs.find(d => d.data().amount === 2000 && d.data().category === 'Mistake');
        expect(txnDoc).toBeDefined();
        const txnId = txnDoc.id;

        // 2. Undo It
        await undo({ transactionId: txnId });

        // 3. Verify Reversal
        const ledgerSnap = await getDoc(doc(db, `users/${uid}/ledgers/main`));
        // Should be back to 59000
        expect(ledgerSnap.data().safeTip).toBe(59000);

        // Verify Txn is Gone
        const deletedSnap = await getDoc(doc(db, `users/${uid}/ledgers/main/transactions/${txnId}`));
        expect(deletedSnap.exists()).toBe(false);
    });
});
