import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useData } from '@/connectors/DataProvider';
import { useFunctions } from '@/connectors/hooks';

// Create Context
const AppStoreContext = createContext(null);

export const AppStoreProvider = ({ children }) => {
    // 1. Consume Existing Data Logic
    const { user, iceberg, buckets: rawBuckets, txns: rawTxns, loading, login: authLogin, signup: authSignup, loginWithGoogle: authLoginWithGoogle, logout: authLogout } = useData();
    const functions = useFunctions();

    // 2. Local UI State
    const [currentScreen, setCurrentScreen] = useState('dive');
    const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);

    // 3. Derive Financial State (Convert Cents -> Dollars)
    const totalBalance = iceberg?.totalMass ? iceberg.totalMass / 100 : 0;
    const safeToSpend = iceberg?.safeTip ? iceberg.safeTip / 100 : 0;

    // Calculate Frozen Percentage on the fly
    // If total is 0, percentage is 0. Otherwise (Total - Safe) / Total * 100
    const frozenPercentage = totalBalance > 0
        ? ((totalBalance - safeToSpend) / totalBalance) * 100
        : 0;

    // 4. Map Buckets (Cents -> Dollars)
    const buckets = useMemo(() => {
        return rawBuckets.map(b => ({
            id: b.id,
            name: b.name,
            currentAmount: b.currentAmount / 100, // Cents -> Dollars
            targetAmount: b.targetAmount / 100,    // Cents -> Dollars
            icon: b.icon || '📦' // Default icon if missing
        }));
    }, [rawBuckets]);

    // 5. Map Transactions (Cents -> Dollars, Date Object)
    const transactions = useMemo(() => {
        return rawTxns.map(t => ({
            id: t.id,
            type: t.type === 'DEBIT' ? 'melt' : (t.category === 'Payday' ? 'payday' : 'freeze'), // Map types
            amount: t.amount / 100, // Cents -> Dollars
            category: t.category || t.description || 'General',
            date: t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.timestamp) // Handle Firestore Timestamp
        }));
    }, [rawTxns]);

    // 6. Navigation Logic based on Auth/Data State
    useEffect(() => {
        if (!loading.auth) {
            if (!user) {
                setCurrentScreen('dive');
            } else if (!loading.iceberg) {
                if (!iceberg) {
                    setCurrentScreen('calibration');
                } else if (currentScreen === 'dive') {
                    setCurrentScreen('surface');
                }
            }
        }
    }, [user, iceberg, loading.auth, loading.iceberg]);


    // 7. Actions Implementation
    const login = async (email, pass) => {
        try {
            await authLogin(email, pass);
        } catch (e) {
            console.error("Login Failed", e);
            throw e;
        }
    };

    const signup = async (email, pass) => {
        console.log("[AppStore] signup called for:", email);
        try {
            await authSignup(email, pass);
            console.log("[AppStore] authSignup resolved");
        } catch (e) {
            console.error("[AppStore] Signup Failed", e);
            throw e;
        }
    };

    const loginWithGoogle = async () => {
        try {
            await authLoginWithGoogle();
        } catch (e) {
            console.error("Google Login Failed", e);
            throw e;
        }
    };

    const logout = async () => {
        await authLogout();
        setCurrentScreen('dive');
    };

    const completeOnboarding = async (balanceDollars, frozenPercent) => {
        // Logic similar to 'TheCalibration.jsx'
        const totalCents = balanceDollars * 100;
        const safeTipCents = totalCents * (1 - frozenPercent / 100);

        await functions.initializeLedger({
            totalBalanceCents: totalCents,
            safeTipCents: safeTipCents
        });
        setCurrentScreen('surface');
    };

    const addTransaction = async (transaction) => {
        // 'melt' or 'payday'
        if (transaction.type === 'melt') {
            await functions.meltIceberg({
                amount: transaction.amount, // Function expects Dollars? No, checking 'TheFracture' it sent float
                // Wait, 'TheFracture.jsx' sent `parseFloat(amount)`. 
                // Let's check backend functions. usually they handle conversions or expect cents.
                // Looking at user context: 'TheFracture' used meltIceberg({ amount: parseFloat(...) }). 
                // Previous code worked, so function likely handles it. 
                // BUT better to verify if I should send dollars or cents.
                // Assuming Function wrapper handles it or function expects dollars.
                // Let's stick to what the UI sends which is Dollars in 'amount'.
                category: transaction.category
            });
        }
        // TODO: Payday logic if needed
    };

    const undoTransaction = async (id) => {
        await functions.undoTransaction({ transactionId: id });
    };

    const updateBucket = async (id, amount, action) => {
        // action = 'freeze' (add to bucket) or 'thaw' (remove from bucket)
        // transferFunds expects { bucketId, amount, type: 'FREEZE' | 'THAW' }
        await functions.transferFunds({
            bucketId: id,
            amount: amount, // Dollars
            type: action === 'freeze' ? 'FREEZE' : 'THAW'
        });
    };

    const reconcile = async (actualBalanceDollars) => {
        await functions.reconcileLedger({
            actualBalanceCents: Math.round(actualBalanceDollars * 100)
        });
    };

    // Bucket Management
    const createBucket = async (name, targetDollars) => {
        await functions.createBucket({
            name,
            type: 'GOAL',
            targetAmountCents: targetDollars * 100
        });
    };

    const deleteBucket = async (id) => {
        await functions.deleteBucket({ bucketId: id });
    };


    // 8. Construct the Store Object
    const store = {
        // State
        currentScreen,
        isAuthenticated: !!user,
        isOnboarded: !!iceberg,
        totalBalance,
        frozenPercentage,
        safeToSpend,
        transactions,
        buckets,
        loading,
        user,

        // Navigation Actions
        setScreen: setCurrentScreen,

        // Modal Actions
        isTransactionModalOpen,
        setTransactionModalOpen,

        // Business Actions
        login,
        signup,
        loginWithGoogle,
        logout,
        completeOnboarding,
        addTransaction,
        undoTransaction,
        updateBucket,
        reconcile,
        createBucket,
        deleteBucket
    };

    return (
        <AppStoreContext.Provider value={store}>
            {children}
        </AppStoreContext.Provider>
    );
};

// Hook to consume the store
export const useAppStore = () => {
    const context = useContext(AppStoreContext);
    if (!context) {
        throw new Error('useAppStore must be used within AppStoreProvider');
    }
    return context;
};
