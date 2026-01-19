import { describe, it, expect, beforeEach } from 'vitest';
import { TransactionService } from '../services/TransactionService';
import { LedgerService } from '../services/LedgerService';
import { BucketService } from '../services/BucketService';
import { db } from '../db/PostgresDb';

describe('TransactionService', () => {
    let txnService, ledgerService, bucketService;

    beforeEach(async () => {
        await db.reset();
        txnService = new TransactionService();
        ledgerService = new LedgerService();
        bucketService = new BucketService();
    });

    it('should log spending (Melt) and reduce Tip', async () => {
        // Setup: $1000 Balance, $100 frozen -> Tip $900
        await ledgerService.initialize({ total_balance: 1000, desired_tip: 900 });

        // Spend $50
        await txnService.logTransaction({ amount: 50, type: 'DEBIT', category: 'Food' });

        // Check Summary
        const summary = await ledgerService.getSummary();
        expect(summary.total_mass).toBe(950); // 1000 - 50
        expect(summary.safe_tip).toBe(850);   // 900 - 50
    });

    it('should handle Payday Auto-Sort (CUJ Scenario)', async () => {
        // 1. Setup: $100 Tip. 
        // Rent Bucket ($1500 target) is empty.
        await ledgerService.initialize({ total_balance: 100, desired_tip: 100 });
        const rent = await bucketService.createBucket({
            name: 'Rent',
            type: 'BILL',
            target: 1500,
            due_date: '2024-02-01'
        });

        // Verify initial state
        const initialSummary = await ledgerService.getSummary();
        expect(initialSummary.safe_tip).toBe(100);
        expect(rent.current).toBe(0);

        // 2. Payday: User gets $2000
        await txnService.logTransaction({ amount: 2000, type: 'CREDIT', category: 'Paycheck' });

        // 3. Verify Logic
        // Total should be 100 + 2000 = 2100
        const finalSummary = await ledgerService.getSummary();
        expect(finalSummary.total_mass).toBe(2100);

        // Rent should be filled ($1500 allocated)
        const updatedBuckets = await bucketService.getBuckets();
        const updatedRent = updatedBuckets.find(b => b.name === 'Rent');
        expect(updatedRent.current).toBe(1500);
        expect(updatedRent.is_filled).toBe(true);

        // Tip should receive remainder:
        // Income (2000) - Allocated (1500) = 500 added to Tip.
        // Old Tip (100) + 500 = 600.
        expect(finalSummary.safe_tip).toBe(600);
    });
});
