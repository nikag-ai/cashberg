import React, { useState } from 'react';
import { useFunctions } from '../../connectors/hooks';
import ScreenHeader from '../core/ScreenHeader';

const TheRepair = ({ uid, onBack }) => {
    const { reconcileLedger } = useFunctions();
    const [bankBalance, setBankBalance] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleRepair = async () => {
        if (!bankBalance) return;
        setLoading(true);
        try {
            // Assume user inputs Dollars, we convert to cents
            const result = await reconcileLedger({
                actualBalanceCents: Math.round(parseFloat(bankBalance) * 100)
            });
            console.log("Reconcile result:", result.data);
            setResult(result.data); // { drift: "$12.50", status: "repaired" }
            setLoading(false);
        } catch (e) {
            console.error("Reconcile failed", e);
            alert("Repair failed: " + e.message);
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--color-text-dark)' }}>
            <ScreenHeader title="THE REPAIR" onBack={onBack} />

            <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
                <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                    <p style={{ marginBottom: '20px', opacity: 0.7 }}>
                        Sync your Iceberg with reality.
                        <br />
                        What is your <b>actual</b> bank balance?
                    </p>

                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>$</div>
                    <input
                        type="number"
                        value={bankBalance}
                        onChange={(e) => setBankBalance(e.target.value)}
                        placeholder="0.00"
                        style={{
                            fontSize: '2rem',
                            padding: '10px',
                            width: '80%',
                            textAlign: 'center',
                            border: 'none',
                            borderBottom: '2px solid #ccc',
                            background: 'transparent',
                            marginBottom: '30px',
                            outline: 'none'
                        }}
                    />

                    <button
                        onClick={handleRepair}
                        className="glass-card"
                        disabled={loading}
                        style={{
                            background: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            padding: '15px 30px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            opacity: loading ? 0.7 : 1,
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? 'CALIBRATING...' : 'RECONCILE'}
                    </button>
                </div>

                {result && (
                    <div className="glass-card" style={{ marginTop: '20px', padding: '20px', textAlign: 'center', background: '#e6f4f1', border: '1px solid #00b894' }}>
                        <h3 style={{ margin: 0, color: '#00b894' }}>Adjustment Complete</h3>
                        <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>
                            Drift: <b>{result.drift}</b>
                        </p>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                            Your Safe Tip has been updated to reflect the truth.
                        </p>
                        <button onClick={onBack} style={{ marginTop: '10px', padding: '10px', background: 'none', border: '1px solid #00b894', borderRadius: '5px', color: '#00b894', cursor: 'pointer' }}>
                            Return to Surface
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default TheRepair;
