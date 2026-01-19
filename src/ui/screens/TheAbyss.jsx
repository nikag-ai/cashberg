import React, { useState } from 'react';
import { useData } from '../../connectors/DataProvider';
import { useFunctions } from '../../connectors/hooks';
import ScreenHeader from '../core/ScreenHeader';
import { Trash2 } from 'lucide-react';

const TheAbyss = ({ uid, onBack }) => {
    // access global data context
    const { buckets, iceberg, loading: { buckets: loading } } = useData();
    const { transferFunds, createBucket, deleteBucket, editBucket } = useFunctions();

    const [expandedId, setExpandedId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newBucketName, setNewBucketName] = useState('');
    const [newBucketTarget, setNewBucketTarget] = useState('');

    // Expanded State
    const [transferAmount, setTransferAmount] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editTarget, setEditTarget] = useState('');
    const [toast, setToast] = useState(null);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

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

    const handleDelete = async (b) => {
        if (confirm(`Delete "${b.name}"? Any funds ($${(b.currentAmount / 100).toFixed(2)}) will return to your Safe Tip.`)) {
            try {
                await deleteBucket({ bucketId: b.id });
                showToast("Bucket deleted.");
                setExpandedId(null);
            } catch (e) {
                console.error(e);
                showToast("Delete failed: " + e.message);
            }
        }
    };

    const handleEdit = async (b) => {
        try {
            await editBucket({
                bucketId: b.id,
                name: editName,
                targetAmountCents: parseFloat(editTarget || 0) * 100
            });
            showToast("Bucket Updated");
            setIsEditing(false);
        } catch (e) {
            console.error(e);
            showToast("Update failed: " + e.message);
        }
    };

    const startEdit = (b) => {
        setEditName(b.name);
        setEditTarget((b.targetAmount / 100).toFixed(2));
        setIsEditing(true);
    };

    const handleTransfer = async (bucketId, type, currentBucketAmount) => {
        const amount = parseFloat(transferAmount);
        if (!amount || amount <= 0) {
            showToast("Please enter a valid amount.");
            return;
        }

        // Validation
        if (type === 'FREEZE') {
            const safeTip = iceberg?.safeTip || 0;
            if (amount * 100 > safeTip) {
                showToast("Not enough Safe Tip to freeze!");
                return;
            }
        } else {
            if (amount * 100 > currentBucketAmount) {
                showToast("Not enough funds in bucket!");
                return;
            }
        }

        try {
            await transferFunds({ bucketId, amount, type });
            showToast(type === 'FREEZE' ? "Funds Frozen ❄️" : "Funds Thawed 💧");
            setTransferAmount(''); // Reset input
        } catch (e) {
            console.error(e);
            showToast(`Transfer failed: ${e.message}`);
        }
    };

    return (
        <div className="view-deep" style={{
            minHeight: '100vh',
            paddingTop: '0px',
            background: 'linear-gradient(to bottom, #0f172a, #020617)',
            position: 'relative'
        }}>
            <ScreenHeader title="THE ABYSS" onBack={onBack} />

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(255, 50, 50, 0.9)', color: 'white', padding: '10px 20px',
                    borderRadius: '20px', zIndex: 100, fontWeight: 'bold'
                }}>
                    {toast}
                </div>
            )}

            {/* Bucket List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {loading && <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>Loading Depths...</div>}

                {!loading && buckets.map(b => (
                    <div key={b.id} className="glass-card-dark" style={{ padding: '20px' }}>
                        <div
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => {
                                if (expandedId === b.id) {
                                    setExpandedId(null);
                                    setIsEditing(false);
                                } else {
                                    setExpandedId(b.id);
                                    setTransferAmount('');
                                    setIsEditing(false);
                                }
                            }}
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

                                {/* Edit Mode */}
                                {isEditing ? (
                                    <div onClick={e => e.stopPropagation()} style={{ marginBottom: '20px', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '10px' }}>
                                        <div style={{ color: '#aaa', marginBottom: '5px', fontSize: '0.8rem' }}>EDIT BUCKET</div>
                                        <input
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            style={{ width: '100%', padding: '10px', marginBottom: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                                        />
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <span style={{ color: '#aaa' }}>Target: $</span>
                                            <input
                                                type="number"
                                                value={editTarget}
                                                onChange={e => setEditTarget(e.target.value)}
                                                style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                            <button onClick={() => handleEdit(b)} style={{ flex: 1, padding: '8px', background: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save</button>
                                            <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid #666', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Normal Expand View */
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                            <input
                                                type="number"
                                                value={transferAmount}
                                                onChange={(e) => setTransferAmount(e.target.value)}
                                                placeholder="0.00"
                                                onClick={e => e.stopPropagation()}
                                                style={{
                                                    flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                                                    background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1.2rem', textAlign: 'center'
                                                }}
                                            />
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleTransfer(b.id, 'FREEZE', b.currentAmount); }}
                                                className="glass-card"
                                                style={{ flex: 1, padding: '10px', fontSize: '0.9rem', cursor: 'pointer', background: 'rgba(50, 150, 255, 0.2)' }}
                                            >
                                                Freeze ❄️
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleTransfer(b.id, 'THAW', b.currentAmount); }}
                                                className="glass-card"
                                                style={{ flex: 1, padding: '10px', fontSize: '0.9rem', cursor: 'pointer', background: 'rgba(255, 100, 100, 0.2)' }}
                                            >
                                                Thaw 🔥
                                            </button>
                                        </div>

                                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); startEdit(b); }}
                                                style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                Edit Details
                                            </button>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(b); }}
                                                style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                            >
                                                <Trash2 size={16} /> Delete Bucket
                                            </button>
                                        </div>
                                    </>
                                )}
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
