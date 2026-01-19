import React, { useState } from 'react';
import { useFunctions } from '../../connectors/hooks';

const TheFracture = ({ onClose }) => {
    const { meltIceberg } = useFunctions();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Coffee');
    const [loading, setLoading] = useState(false);

    // Keypad Logic
    const handleKey = (key) => {
        setAmount(prev => {
            if (key === '⌫') return prev.slice(0, -1);
            if (prev.includes('.') && key === '.') return prev;
            if (prev.length > 6) return prev;
            return prev + key;
        });
    };

    const handleMelt = async () => {
        if (!amount) return;
        setLoading(true);
        try {
            await meltIceberg({
                amount: parseFloat(amount),
                category
            });
            onClose();
        } catch (e) {
            console.error("Melt failed", e);
            alert("Melt failed");
            setLoading(false);
        }
    };

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0, left: 0, right: 0,
            height: '80vh',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            borderTopLeftRadius: '30px',
            borderTopRightRadius: '30px',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
        }}>
            {/* Drag Handle & Header */}
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '5px', background: '#ccc', borderRadius: '10px' }} onClick={onClose} />

                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', right: 0, top: -5,
                        background: 'none', border: 'none',
                        fontSize: '1.5rem', fontWeight: 'bold', color: '#888',
                        padding: '10px', marginTop: '-10px'
                    }}
                >
                    ✕
                </button>
            </div>

            {/* Display */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="text-huge" style={{ color: 'var(--color-melt)' }}>
                    -${amount || '0'}
                </div>
            </div>

            {/* Category Slider (Simple Scroll) */}
            <div style={{
                display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px',
                marginBottom: '10px'
            }}>
                {['Coffee', 'Food', 'Transport', 'Groceries', 'Fun', 'Bills'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={category === cat ? "glass-card-dark" : "glass-card"}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '20px',
                            border: 'none',
                            color: category === cat ? 'white' : '#333',
                            background: category === cat ? 'var(--color-melt)' : 'white',
                            flexShrink: 0
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Keypad */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px',
                marginBottom: '20px'
            }}>
                {keys.map(k => (
                    <button
                        key={k}
                        onClick={() => handleKey(k)}
                        style={{
                            padding: '20px',
                            borderRadius: '50%',
                            border: 'none',
                            fontSize: '1.5rem',
                            background: 'transparent',
                            fontWeight: 'bold',
                            color: '#333'
                        }}
                    >
                        {k}
                    </button>
                ))}
            </div>

            {/* Melt Button */}
            <button
                onClick={handleMelt}
                className="glass-card"
                style={{
                    background: 'var(--color-melt)',
                    color: 'white',
                    border: 'none',
                    padding: '20px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 5px 15px rgba(255,107,107,0.4)',
                    opacity: loading ? 0.7 : 1
                }}
            >
                {loading ? 'MELTING...' : 'MELT IT'}
            </button>
        </div>
    );
};

export default TheFracture;
