import { describe, it, expect, beforeEach } from 'vitest';
import { BucketService } from '../services/BucketService';
import { db } from '../db/PostgresDb';
import { LedgerService } from '../services/LedgerService'; // Need ledger for FK constraints

describe('BucketService', () => {
    let service;
    let ledgerService;

    beforeEach(async () => {
        await db.reset();
        service = new BucketService();
        ledgerService = new LedgerService();
        // Buckets need a ledger foreign key usually, or we updated schema to nullable?
        // Schema says: ledger_id UUID REFERENCES ledgers(id)
        // So we MUST create a ledger first.
        await ledgerService.initialize({ total_balance: 1000, desired_tip: 100 });
    });

    it('should create and list buckets', async () => {
        await service.createBucket({ name: 'Rent', type: 'BILL', target: 2000 });
        const buckets = await service.getBuckets();

        expect(buckets).toHaveLength(1);
        expect(buckets[0].name).toBe('Rent');
        expect(buckets[0].target).toBe(2000);
        expect(buckets[0].current).toBe(0);
    });

    it('should freeze funds (add to bucket)', async () => {
        const bucket = await service.createBucket({ name: 'Vacation', type: 'GOAL', target: 1000 });

        const updated = await service.transfer({
            bucketId: bucket.id,
            amount: 500,
            action: 'FREEZE'
        });

        expect(updated.current).toBe(500);
        expect(updated.is_filled).toBe(false);
    });

    it('should thaw funds (remove from bucket) and validate insufficient funds', async () => {
        const bucket = await service.createBucket({ name: 'Emergency', type: 'GHOST', target: 0 });

        // Put money in first
        await service.transfer({ bucketId: bucket.id, amount: 1000, action: 'FREEZE' });

        // Take some out
        const updated = await service.transfer({ bucketId: bucket.id, amount: 200, action: 'THAW' });
        expect(updated.current).toBe(800);

        // Try to take too much
        await expect(service.transfer({ bucketId: bucket.id, amount: 900, action: 'THAW' }))
            .rejects.toThrow("Insufficient funds");
    });
});
