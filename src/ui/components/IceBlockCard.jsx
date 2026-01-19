import React from 'react';
import GlassContainer from './GlassContainer';
import { Lock } from 'lucide-react';

const IceBlockCard = ({ title, amount, locked = true }) => {
    return (
        <GlassContainer
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                marginBottom: '16px',
                background: 'rgba(255, 255, 255, 0.05)', // slightly more opaque/different for "embedded" look
                boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)' // inner shadow
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {locked && <Lock size={16} color="rgba(255,255,255,0.7)" />}
                <span style={{ fontSize: '16px', fontWeight: 500, color: '#F1F5F9' }}>{title}</span>
            </div>

            <span className="text-mono" style={{ fontSize: '18px', color: '#E0F7FA' }}>
                ${amount.toLocaleString()}
            </span>
        </GlassContainer>
    );
};

export default IceBlockCard;
