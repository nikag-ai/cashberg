import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AppStoreProvider, useAppStore } from '../store/appStore';
import { DataProvider } from '../connectors/DataProvider';
import TheCalibration from '../ui/screens/TheCalibration';
import TheFracture from '../ui/screens/TheFracture';
import TheRepair from '../ui/screens/TheRepair';
import TheSurface from '../ui/screens/TheSurface';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, signInAnonymously, signOut } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, doc, getDoc, setDoc } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// --- Test Config ---
const firebaseConfig = {
    projectId: "cashberg-fc307",
    apiKey: "fake-api-key",
    authDomain: "cashberg-fc307.firebaseapp.com",
};

let app, auth, db, functions, uid;


// ... (imports remain)

// --- Setup ---
beforeAll(async () => {
    // 1. Get or Init App (hooks.js might have done it)
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

    auth = getAuth(app);
    db = getFirestore(app);
    functions = getFunctions(app);

    // 2. Connect Emulators only if not already connected
    // We can check a global flag or try/catch. 
    // Auth doesn't have a check, but doing it twice throws or warns? 
    // Actually, usually it's fine unless "different config".
    // hooks.js sets globalThis._emulatorsConnected. We can reuse it.

    if (!globalThis._emulatorsConnected) {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099');
        connectFirestoreEmulator(db, 'localhost', 8080);
        connectFunctionsEmulator(functions, 'localhost', 5001);
        globalThis._emulatorsConnected = true;
    }

    // Sign in as a unique test user
    const cred = await signInAnonymously(auth);
    uid = cred.user.uid;
});

afterAll(async () => {
    await signOut(auth);
});

// --- Wrapper Component ---
const TestWrapper = ({ children }) => (
    <DataProvider>
        <AppStoreProvider>
            {children}
        </AppStoreProvider>
    </DataProvider>
);

// --- Tests ---
describe('Full Stack CUJs', () => {

    it('CUJ 1: Calibration (Onboarding)', async () => {

        // 1. Render Calibration Screen
        render(
            <TestWrapper>
                <TheCalibration />
            </TestWrapper>
        );

        // 2. Simulate User Input
        const user = userEvent.setup();
        // Find input by role (type="number") since label is not associated
        const balanceInput = screen.getByRole('spinbutton');
        // Note: TheCalibration input labels are a bit custom, let's target by type or layout
        // Looking at code: <label>TOTAL BANK BALANCE</label> then <input> inside a div.
        // It might not be associated by 'for'. Using placeholder or display value might be safer or getting by role.
        // The input has type="number" and value defaults to 5000.

        // Let's assume we can find it. If not, we'll debug selectors.
        // The file has: <label ...>TOTAL BANK BALANCE</label> ... <input ... value={totalMass} ...>
        // It's not nested inside label, so getByLabelText might fail unless ID'd.
        // We'll try finding by display value since it inits with 5000.
        const input = screen.getByDisplayValue('5000');
        await user.clear(input);
        await user.type(input, '35000'); // $35k

        // 3. Adjust Safety Margin (Slider)
        // Slider is type="range". Default 10.
        // We'll leave it or try to move it. Range inputs are tricky with userEvent.
        // For this test, let's stick to default 10% safety margin.
        // 10% of 35,000 = 3,500 Safe to Spend.

        // 4. Click Freeze
        const freezeBtn = screen.getByText(/FREEZE THIS STATE/i);
        await user.click(freezeBtn);

        // 5. Verify Database State
        // Wait for async write...
        await waitFor(async () => {
            const snap = await getDoc(doc(db, `users/${uid}/ledgers/main`));
            expect(snap.exists()).toBe(true);
            const data = snap.data();
            expect(data.totalMass).toBe(3500000); // 35000 * 100
            expect(data.safeTip).toBe(350000);   // 3500 * 100
        }, { timeout: 5000 });
    });

    it('CUJ 2: Fracture (Spending)', async () => {
        // Pre-condition: User has $35k balance, $3.5k safe tip.

        // 1. Render Fracture Screen
        // We need to render the Keypad.
        render(
            <TestWrapper>
                <TheFracture />
            </TestWrapper>
        );

        const user = userEvent.setup();

        // 2. Input Amount: $50
        // TheKeypad buttons... we need to click them.
        // Assuming defined buttons 1-9, 0, .
        await user.click(screen.getByText('5'));
        await user.click(screen.getByText('0'));

        // 3. Click Melt
        const meltBtn = screen.getByRole('button', { name: /melt/i }); // Need to verify button name/aria
        // Looking at TheFracture code (I'll need to check it if fails, but guessing 'MELT' text exists)
        // Actually, let's check class "action-btn" or similar.
        // Ideally, we'd add test-ids, but let's try text.
        await user.click(screen.getByText(/MELT/i));

        // 4. Verify DB Update
        await waitFor(async () => {
            const snap = await getDoc(doc(db, `users/${uid}/ledgers/main`));
            const data = snap.data();
            // Old Tip: 350,000
            // Melt: 5,000 (50 * 100)
            // New Tip: 345,000
            expect(data.safeTip).toBe(345000);
        });
    });

    it('CUJ 3: Repair (Reconciliation)', async () => {
        // Pre-condition: Total 35,000 - 50 = 34,950. Tip 3,450.
        // Logic: User says actual balance is 35,000 (Found $50).
        // Drift = +$50. Should be added to Tip.
        // New Tip = 3,450 + 50 = 3,500.

        render(
            <TestWrapper>
                <TheRepair />
            </TestWrapper>
        );
        const user = userEvent.setup();

        // Input 35000
        const inputs = screen.getAllByRole('spinbutton'); // Assuming number input
        // Or find by value. Since it might display current balance (34950), let's find that.
        // Wait, TheRepair usually fetches current balance to prefill? Or starts empty/0?
        // Let's assume we type 35000.
        const input = inputs[0];
        await user.clear(input);
        await user.type(input, '35000');

        // Click Reconcile
        const btn = screen.getByText(/RECONCILE/i);
        await user.click(btn);

        // Verify DB
        await waitFor(async () => {
            const snap = await getDoc(doc(db, `users/${uid}/ledgers/main`));
            const data = snap.data();
            expect(data.totalMass).toBe(3500000);
            expect(data.safeTip).toBe(350000); // Back to 3500
        });
    });

});
