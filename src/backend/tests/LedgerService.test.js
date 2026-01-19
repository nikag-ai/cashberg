import { describe, it, expect, beforeEach } from 'vitest';
import { LedgerService } from '../services/LedgerService';
import { db } from '../db/PostgresDb';

describe('LedgerService', () => {
    let service;

    beforeEach(async () => {
        await db.reset(); // This handles init as well
        service = new LedgerService();
    });

    it('should initialize ledger correctly', async () => {
        const result = await service.initialize({
            total_balance: 5000,
            desired_tip: 500
        });

        expect(result.total_mass).toBe(5000);
        expect(result.safe_tip).toBe(500);

        // Verify Bucket Creation
        const buckets = await db.getBuckets();
        expect(buckets).toHaveLength(1);
        expect(buckets[0].name).toBe('General Savings');
        expect(buckets[0].current).toBe(4500);
    });

    it('should calculate summary correctly', async () => {
        // Init first
        await service.initialize({ total_balance: 1000, desired_tip: 200 });

        const summary = await service.getSummary();
        expect(summary.total_mass).toBe(1000);
        expect(summary.frozen_mass).toBe(800); // 1000 - 200
        expect(summary.safe_tip).toBe(200);
        expect(summary.health).toBe('STABLE');
    });

    it('should handle reconciliation (negative drift)', async () => {
        await service.initialize({ total_balance: 1000, desired_tip: 200 });

        // User actually has 900 (lost 100)
        const result = await service.reconcile({ actual_bank_balance: 900 });

        expect(result.drift).toBe(-100);

        // Verify Ledger Update
        const summary = await service.getSummary();
        expect(summary.total_mass).toBe(900);
        // Frozen stays 800, so Tip should drop to 100
        expect(summary.safe_tip).toBe(100);
    });
});
