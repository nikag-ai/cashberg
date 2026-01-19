import React, { createContext, useContext } from 'react';
import { useAuth, useIceberg, useBuckets, useTransactions } from './hooks';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const { user, loading: authLoading, login, logout } = useAuth();

    // Hooks handle their own "if no uid, return empty/loading" logic
    const { data: iceberg, loading: icebergLoading } = useIceberg(user?.uid);
    const { buckets, loading: bucketsLoading } = useBuckets(user?.uid);
    const { txns, loading: txnsLoading } = useTransactions(user?.uid);

    // Global Loading State (Optional, or detailed)
    const initialLoading = authLoading || (user && (icebergLoading && bucketsLoading && txnsLoading));

    return (
        <DataContext.Provider value={{
            user,
            login,
            logout,
            iceberg,
            buckets,
            txns,
            // Expose individual loading states if needed
            loading: {
                auth: authLoading,
                iceberg: icebergLoading,
                buckets: bucketsLoading,
                txns: txnsLoading
            }
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
