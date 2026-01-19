import React from 'react';
import { useAuth } from '../../connectors/hooks';

const TheSurface = ({ iceberg, onMelt, onDive }) => {
    const { logout } = useAuth();
    const safeTip = iceberg ? (iceberg.safeTip / 100).toFixed(2) : '0.00';
    const isFractured = iceberg?.status === 'fractured';

    return (
        <div className="view-tip" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '70vh', // Takes top 70%
            transition: 'all 0.5s ease',
            position: 'relative'
        }}>
            {/* Logout Button */}
            <button
                onClick={logout}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-dark)',
                    fontWeight: 'bold'
                }}
            >
                LOGOUT
            </button>

            {/* The Big Number */}
            <div style={{ zIndex: 5, textAlign: 'center' }}>
                <div className="text-huge" style={{
                    color: isFractured ? 'var(--color-melt)' : 'var(--color-text-dark)',
                    textShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    ${safeTip}
                </div>
                <div className="text-label" style={{ marginTop: '10px' }}>SAFE TO SPEND</div>
            </div>

            {/* The Iceberg Visual */}
            <div className="animate-float" style={{
                marginTop: '40px',
                width: '120px',
                height: '120px',
                background: isFractured ? '#ffecec' : 'var(--ice-tip-bg)',
                borderRadius: '20px',
                transform: 'rotate(45deg)',
                boxShadow: '0 20px 40px var(--ice-shadow)',
                border: '2px solid rgba(255,255,255,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
            }} onClick={onMelt}>
                <span style={{ transform: 'rotate(-45deg)', fontSize: '2rem' }}>
                    {isFractured ? '⚡️' : '🧊'}
                </span>
            </div>

            {/* Weather / Status */}
            <div style={{ marginTop: '40px', opacity: 0.6, fontSize: '0.9rem' }}>
                {isFractured ? 'Iceberg Fractured!' : 'Stable Conditions'}
            </div>

            {/* Melt FAB */}
            <button
                onClick={onMelt}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    background: 'var(--color-melt)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '64px',
                    height: '64px',
                    fontSize: '1.5rem',
                    boxShadow: '0 10px 20px rgba(255, 107, 107, 0.4)',
                    cursor: 'pointer',
                    zIndex: 10
                }}
            >
                -
            </button>


        </div>
    );
};

export default TheSurface;
