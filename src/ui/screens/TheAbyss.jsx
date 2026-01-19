import React, { useState } from 'react';
import { useData } from '../../connectors/DataProvider';
import { useFunctions } from '../../connectors/hooks';
import ScreenHeader from '../core/ScreenHeader';

const TheAbyss = ({ uid, onBack }) => {
    // access global data context
    const { buckets, loading: { buckets: loading } } = useData();
    const { transferFunds, createBucket } = useFunctions();

    const [expandedId, setExpandedId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newBucketName, setNewBucketName] = useState('');
    const [newBucketTarget, setNewBucketTarget] = useState('');

    const handleCreate = async () => {
        if (!newBucketName) return;
        await createBucket({
            name: newBucketName,
            type: 'GOAL', // Default for now
            targetAmountCents: parseFloat(newBucketTarget || 0) * 100
        });
        setIsCreating(false);
        setNewBucketName('');
        setNewBucketTarget('');
    };

    const handleTransfer = async (bucketId, amount, type) => {
        try {
            await transferFunds({ bucketId, amount, type });
        } catch (e) {
            console.error(e);
            alert(`Transfer failed: ${e.message}`);
        }
    };

    return (
        <div className="view-deep" style={{
            minHeight: '100vh',
            // padding: '20px', Removed padding as Header has it
            paddingTop: '0px',
            background: 'linear-gradient(to bottom, #0f172a, #020617)'
        }}>
            <ScreenHeader title="THE ABYSS" onBack={onBack} />

            {/* Bucket List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {loading && <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>Loading Depths...</div>}

                {!loading && buckets.map(b => (
                    <div key={b.id} className="glass-card-dark" style={{ padding: '20px' }}>
                        <div
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                        >
                            <div>
                                <div className="text-label" style={{ color: '#aaa', fontSize: '0.8rem' }}>{b.type}</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>{b.name}</div>
                            </div>
                            <div className="text-mono" style={{ textAlign: 'right' }}>
                                <div style={{ color: 'white', fontSize: '1.2rem' }}>${(b.currentAmount / 100).toFixed(2)}</div>
                                {b.targetAmount > 0 && (
                                    <div style={{ color: '#666', fontSize: '0.8rem' }}>
                                        / ${(b.targetAmount / 100).toFixed(2)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Expanded Controls */}
                        {expandedId === b.id && (
                            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ color: '#aaa', marginBottom: '10px', fontSize: '0.9rem' }}>Quick Transfer</div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleTransfer(b.id, 10, 'FREEZE')}
                                        className="glass-card"
                                        style={{ flex: 1, padding: '10px', fontSize: '0.9rem', cursor: 'pointer' }}
                                    >
                                        Freeze $10
                                    </button>
                                    <button
                                        onClick={() => handleTransfer(b.id, 10, 'THAW')}
                                        className="glass-card"
                                        style={{ flex: 1, padding: '10px', fontSize: '0.9rem', cursor: 'pointer' }}
                                    >
                                        Thaw $10
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Create New Block */}
            <div style={{ marginTop: '30px' }}>
                {!isCreating ? (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="glass-card"
                        style={{ width: '100%', padding: '15px', color: '#ccc', border: '1px dashed #666' }}
                    >
                        + New Block
                    </button>
                ) : (
                    <div className="glass-card-dark" style={{ padding: '20px' }}>
                        <input
                            placeholder="Name (e.g. Rent)"
                            value={newBucketName}
                            onChange={e => setNewBucketName(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                        />
                        <input
                            type="number"
                            placeholder="Target $"
                            value={newBucketTarget}
                            onChange={e => setNewBucketTarget(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleCreate} style={{ flex: 1, padding: '10px', background: 'white', border: 'none', borderRadius: '5px' }}>Create</button>
                            <button onClick={() => setIsCreating(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #666', color: 'white', borderRadius: '5px' }}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TheAbyss;
