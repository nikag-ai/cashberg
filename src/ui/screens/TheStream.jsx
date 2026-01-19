import React, { useState } from 'react';
import { useData } from '../../connectors/DataProvider';
import { useFunctions } from '../../connectors/hooks';
import ScreenHeader from '../core/ScreenHeader';

const TheStream = ({ uid, onBack }) => {
    // access global data context
    const { txns, loading: { txns: loading } } = useData();
    const { undoTransaction } = useFunctions();
    const [loadingIds, setLoadingIds] = useState(new Set());
    const [confirmId, setConfirmId] = useState(null);

    const getIcon = (type) => {
        switch (type) {
            case 'DEBIT': return '🔥'; // Melt
            case 'CREDIT': return '💰'; // Payday
            default: return '❄️'; // Freeze/Thaw
        }
    };

    const handleUndoClick = async (t) => {
        if (confirmId === t.id) {
            // Second click: Execute
            setLoadingIds(prev => new Set(prev).add(t.id));
            setConfirmId(null); // Clear confirm state
            try {
                await undoTransaction({ transactionId: t.id });
            } catch (e) {
                alert(e.message);
                // On error, remove loading state
                setLoadingIds(prev => {
                    const next = new Set(prev);
                    next.delete(t.id);
                    return next;
                });
            }
        } else {
            // First click: Request confirmation
            setConfirmId(t.id);
            // Reset after 3 seconds if not confirmed
            setTimeout(() => {
                setConfirmId(curr => curr === t.id ? null : curr);
            }, 3000);
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
            <ScreenHeader title="THE STREAM" onBack={onBack} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 20px' }}>
                {loading && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                        Loading...
                    </div>
                )}
                {!loading && txns.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🌫️</div>
                        <p>No recent activity.</p>
                        <p style={{ fontSize: '0.8rem' }}>Melts and Thaws will appear here.</p>
                    </div>
                )}
                {txns.map(t => (
                    <div key={t.id} className="glass-card" style={{
                        display: 'flex', alignItems: 'center', padding: '15px',
                        opacity: loadingIds.has(t.id) ? 0.5 : 1,
                        transition: 'opacity 0.3s'
                    }}>
                        <div style={{ fontSize: '1.5rem', marginRight: '15px' }}>
                            {getIcon(t.type)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>{t.category || t.description}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                {t.timestamp?.toDate().toLocaleDateString()}
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '5px'
                        }}>
                            <div className="text-mono" style={{
                                color: t.type === 'DEBIT' ? 'var(--color-melt)' : 'var(--color-text-dark)',
                                fontWeight: 'bold'
                            }}>
                                {t.type === 'DEBIT' ? '-' : '+'}${(t.amount / 100).toFixed(2)}
                            </div>

                            {/* Delete Button (Only for melt/reconcile, not Payday) */}
                            {t.category !== 'Payday' && (
                                <button
                                    onClick={() => handleUndoClick(t)}
                                    disabled={loadingIds.has(t.id)}
                                    style={{
                                        background: confirmId === t.id ? 'var(--color-melt)' : 'none',
                                        border: confirmId === t.id ? 'none' : '1px solid #ddd',
                                        borderRadius: '4px',
                                        color: confirmId === t.id ? 'white' : '#aaa',
                                        cursor: 'pointer',
                                        fontSize: '0.7rem',
                                        padding: '4px 8px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.2s',
                                        minWidth: '60px'
                                    }}
                                >
                                    {loadingIds.has(t.id) ? '...' : (confirmId === t.id ? 'SURE?' : 'UNDO')}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TheStream;
