import React, { useState } from 'react';
import { motion } from 'framer-motion';
import OceanBackground from '../components/OceanBackground';
import GlassContainer from '../components/GlassContainer';
import { ScanFace } from 'lucide-react';

const TheDive = ({ onComplete }) => {
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const handleAuth = () => {
        setIsAuthenticating(true);
        // Simulate auth + pan up transition
        setTimeout(onComplete, 2000);
    };

    return (
        <div className="full-screen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <OceanBackground depth="deep" />

            {/* Pan Up Effect Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAuthenticating ? 1 : 0 }}
                transition={{ duration: 1.5 }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, #E0F7FA 0%, transparent 100%)',
                    pointerEvents: 'none',
                    zIndex: 100
                }}
            />

            <GlassContainer
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: isAuthenticating ? 500 : 0, opacity: isAuthenticating ? 0 : 1 }}
                transition={{ duration: 0.8 }}
                style={{ width: '80%', maxWidth: '320px', textAlign: 'center' }}
            >
                <h1 style={{
                    color: '#E0F7FA',
                    fontSize: '32px',
                    marginBottom: '40px',
                    textShadow: '0 0 20px rgba(224, 247, 250, 0.5)'
                }}>
                    Cashberg
                </h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="text"
                        placeholder="Email"
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--color-ice-border)',
                            borderRadius: '12px',
                            padding: '16px',
                            color: 'white',
                            outline: 'none',
                            backdropFilter: 'blur(5px)'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--color-ice-border)',
                            borderRadius: '12px',
                            padding: '16px',
                            color: 'white',
                            outline: 'none',
                            backdropFilter: 'blur(5px)'
                        }}
                    />
                </div>

                <motion.button
                    onClick={handleAuth}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        marginTop: '40px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#E0F7FA',
                        width: '100%'
                    }}
                >
                    <div style={{
                        padding: '16px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid var(--color-ice-border)'
                    }}>
                        <ScanFace size={32} />
                    </div>
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>Face ID</span>
                </motion.button>

            </GlassContainer>
        </div>
    );
};

export default TheDive;
