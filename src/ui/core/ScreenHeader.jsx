import React from 'react';

const ScreenHeader = ({ title, onBack }) => (
    <div style={{
        display: 'flex', alignItems: 'center',
        padding: '20px 20px 10px 20px',
        marginBottom: '10px'
    }}>
        {onBack && (
            <button
                onClick={onBack}
                style={{
                    background: 'rgba(255,255,255,0.2)', border: 'none',
                    borderRadius: '50%', width: '40px', height: '40px',
                    color: 'white', marginRight: '15px', cursor: 'pointer',
                    backdropFilter: 'blur(5px)'
                }}
            >
                ←
            </button>
        )}
        <h2 className="text-display" style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>{title}</h2>
    </div>
);
export default ScreenHeader;
