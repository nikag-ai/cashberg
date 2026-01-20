import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppStoreProvider, useAppStore } from './appStore';
import * as DataProvider from '../connectors/DataProvider';
import * as Hooks from '../connectors/hooks';

// Mock dependencies
vi.mock('../connectors/DataProvider', () => ({
    useData: vi.fn()
}));

vi.mock('../connectors/hooks', () => ({
    useFunctions: vi.fn()
}));

describe('appStore', () => {
    it('should correctly calculate totalBalance and safeToSpend from backend data (cents -> dollars)', () => {
        // Mock Data
        const mockIceberg = {
            totalMass: 3500000, // $35,000.00
            safeTip: 2000000,   // $20,000.00
            status: 'stable'
        };

        DataProvider.useData.mockReturnValue({
            user: { uid: 'test-user' },
            iceberg: mockIceberg,
            buckets: [],
            txns: [],
            loading: { auth: false, iceberg: false },
            login: vi.fn(),
            signup: vi.fn(),
            loginWithGoogle: vi.fn(),
            logout: vi.fn()
        });

        Hooks.useFunctions.mockReturnValue({
            initializeLedger: vi.fn()
        });

        const wrapper = ({ children }) => <AppStoreProvider>{children}</AppStoreProvider>;
        const { result } = renderHook(() => useAppStore(), { wrapper });

        // Verify Fix: Should be dollars
        expect(result.current.totalBalance).toBe(35000);
        expect(result.current.safeToSpend).toBe(20000);
    });

    it('should handle missing iceberg data (default 0)', () => {
        DataProvider.useData.mockReturnValue({
            user: { uid: 'test-user' },
            iceberg: null,
            buckets: [],
            txns: [],
            loading: { auth: false, iceberg: false },
            login: vi.fn(),
            signup: vi.fn(),
            loginWithGoogle: vi.fn(),
            logout: vi.fn()
        });

        Hooks.useFunctions.mockReturnValue({});

        const wrapper = ({ children }) => <AppStoreProvider>{children}</AppStoreProvider>;
        const { result } = renderHook(() => useAppStore(), { wrapper });

        expect(result.current.totalBalance).toBe(0);
        expect(result.current.safeToSpend).toBe(0);
    });
});
