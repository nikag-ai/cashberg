import React from 'react';
import { motion } from 'framer-motion';
import OceanBackground from '../components/OceanBackground';
import IceBlockCard from '../components/IceBlockCard';
import { Plus } from 'lucide-react';
import GlassContainer from '../components/GlassContainer';

const TheAbyss = ({ onNavigate, onScrollUp }) => {
    return (
        <div className="full-screen" style={{ overflowY: 'auto' }}> {/* Allow scroll within this 'page' for demo */}
            <OceanBackground depth="deep" />

            <div style={{ padding: '24px', paddingBottom: '100px' }}>

                {/* Back to Surface Hint */}
                <div
                    onClick={onScrollUp}
                    style={{
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.3)',
                        marginBottom: '40px',
                        cursor: 'pointer'
                    }}>
                    ↑ SURFACE
                </div>

                <GlassContainer style={{ marginBottom: '32px' }}>
                    <h2 style={{ color: '#E0F7FA', margin: '0 0 16px 0', fontSize: '18px' }}>Upcoming Bills</h2>
                    <IceBlockCard title="Rent" amount={1500} locked={true} />
                    <IceBlockCard title="Car Payment" amount={350} locked={true} />
                </GlassContainer>

                <GlassContainer>
                    <h2 style={{ color: '#E0F7FA', margin: '0 0 16px 0', fontSize: '18px' }}>Deep Freeze</h2>
                    <IceBlockCard title="Emergency Fund" amount={2000} locked={true} />
                    <IceBlockCard title="Vacation" amount={800} locked={true} />

                    {/* Add Block Button */}
                    <button style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '16px',
                        border: '2px dashed rgba(255,255,255,0.2)',
                        background: 'transparent',
                        color: 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <Plus size={20} />
                        <span>Add Block</span>
                    </button>
                </GlassContainer>
            </div>

            {/* Sticky Footer */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '24px',
                background: 'linear-gradient(to top, #020617 80%, transparent)',
                textAlign: 'center'
            }}>
                <span style={{ color: '#94A3B8', fontSize: '12px' }}>TOTAL MASS</span>
                <div className="text-mono" style={{ color: '#E0F7FA', fontSize: '20px' }}>$5,000</div>
            </div>
        </div>
    );
};

export default TheAbyss;
