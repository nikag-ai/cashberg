import React, { useState } from 'react';
import { useFunctions, useAuth } from '../../connectors/hooks';

const TheCalibration = () => {
    const { initializeLedger } = useFunctions();
    const { logout } = useAuth();
    const [totalMass, setTotalMass] = useState(5000); // Default $5000
    const [seaLevel, setSeaLevel] = useState(10); // 0-100% (Safety Percentage)
    const [isFreezing, setIsFreezing] = useState(false);

    // Calculated Values
    const safeTip = Math.round(totalMass * (seaLevel / 100));
    const frozenMass = totalMass - safeTip;

    const handleFreeze = async () => {
        setIsFreezing(true);
        try {
            await initializeLedger({
                totalBalanceCents: totalMass * 100,
                safeTipCents: safeTip * 100
            });
            // App.jsx will auto-redirect when 'iceberg' data appears
        } catch (e) {
            console.error("Freeze failed", e);
            setIsFreezing(false);
            alert("Failed to freeze: " + e.message);
        }
    };

    return (
        <div className="view-deep" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative'
        }}>
            {/* Logout Button */}
            <button
                onClick={logout}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: 'white',
                    fontWeight: 'bold',
                    zIndex: 10
                }}
            >
                LOGOUT
            </button>

            {/* Background Iceberg Visual (Simple CSS) */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: '10%',
                right: '10%',
                height: `${100 - seaLevel}%`, // Inverted: Higher sea level = Less Ice Visible? 
                // Wait, Sea Level rises... 
                // Let's say Slider 0 = All Ice (Tip = Total). Slider 100 = No Ice (Tip = 0).
                // "Water Level" rising covers the ice.
                background: 'linear-gradient(to bottom, var(--ice-tip-accent), white)',
                opacity: 0.1,
                zIndex: 0
            }} />

            <h1 className="text-huge" style={{ zIndex: 1, color: 'white' }}>Calibration</h1>

            {/* Input: Total Mass */}
            <div className="glass-card-dark" style={{ padding: '20px', marginBottom: '20px', zIndex: 1 }}>
                <label className="text-label" style={{ color: '#aaa' }}>TOTAL BANK BALANCE</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="text-lg" style={{ color: 'white' }}>$</span>
                    <input
                        type="number"
                        value={totalMass}
                        onChange={(e) => setTotalMass(Number(e.target.value))}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '2rem',
                            fontFamily: 'var(--font-mono)',
                            width: '100%',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Slider: Sea Level */}
            <div className="glass-card-dark" style={{ padding: '20px', marginBottom: '40px', zIndex: 1 }}>
                <label className="text-label" style={{ color: '#aaa', display: 'flex', justifyContent: 'space-between' }}>
                    <span>WATER LEVEL</span>
                    <span>{seaLevel}% SUBMERGED</span>
                </label>

                <input
                    type="range"
                    min="0" max="90"
                    value={seaLevel}
                    onChange={(e) => setSeaLevel(Number(e.target.value))}
                    style={{
                        width: '100%',
                        marginTop: '15px',
                        accentColor: 'var(--water-line-color)'
                    }}
                />

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <div className="text-label" style={{ color: 'var(--ice-tip-accent)' }}>SAFE TO SPEND (THE TIP)</div>
                    <div className="text-huge" style={{ color: 'white' }}>${safeTip}</div>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={handleFreeze}
                disabled={isFreezing}
                className="glass-card"
                style={{
                    padding: '20px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: 'var(--color-text-dark)',
                    cursor: 'pointer',
                    zIndex: 1,
                    background: isFreezing ? '#ccc' : 'var(--ice-tip-bg)'
                }}
            >
                {isFreezing ? 'FREEZING...' : 'FREEZE THIS STATE'}
            </button>

        </div>
    );
};

export default TheCalibration;
