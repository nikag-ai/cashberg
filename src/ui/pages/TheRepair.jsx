import React, { useState } from 'react';
import { motion } from 'framer-motion';
import OceanBackground from '../components/OceanBackground';
import GlassContainer from '../components/GlassContainer';
import { RefreshCcw } from 'lucide-react';

const TheRepair = ({ onComplete }) => {
    const [bankBalance, setBankBalance] = useState('');
    const appBalance = 412;

    const diff = bankBalance ? parseFloat(bankBalance) - appBalance : 0;

    return (
        <div className="full-screen" style={{ background: '#0F172A', color: '#E2E8F0' }}>

            {/* Grid Overlay for Engineering Effect */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: 0.5
            }} />

            <div style={{ padding: '24px', position: 'relative', zIndex: 1, paddingTop: '60px' }}>

                <h1 style={{ fontSize: '20px', fontFamily: 'var(--font-mono)', textAlign: 'center', marginBottom: '40px', color: '#94A3B8' }}>
              // SYSTEM REPAIR
                </h1>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
                    {/* App State */}
                    <GlassContainer style={{ flex: 1, textAlign: 'center', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>CASHBERG</div>
                        <div className="text-mono" style={{ fontSize: '20px' }}>${appBalance}</div>
                    </GlassContainer>

                    {/* Bank State */}
                    <GlassContainer style={{ flex: 1, textAlign: 'center', borderRadius: '12px', border: '1px dashed #64748B' }}>
                        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>ACTUAL</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '20px' }}>$</span>
                            <input
                                type="number"
                                value={bankBalance}
                                onChange={(e) => setBankBalance(e.target.value)}
                                placeholder="0"
                                className="text-mono"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '20px',
                                    width: '60px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </GlassContainer>
                </div>

                {/* Drift Indicator */}
                {bankBalance && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                            textAlign: 'center',
                            marginBottom: '60px',
                            padding: '12px',
                            background: diff === 0 ? 'var(--color-surface-end)' : '#EF4444',
                            color: diff === 0 ? 'black' : 'white',
                            borderRadius: '99px',
                            display: 'inline-block',
                            position: 'relative',
                            left: '50%',
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <span className="text-mono" style={{ fontWeight: 'bold' }}>
                            DRIFT: {diff > 0 ? '+' : ''}{diff}
                        </span>
                    </motion.div>
                )}

                {/* Refreeze Button */}
                <motion.button
                    onClick={onComplete}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        width: '100%',
                        padding: '20px',
                        background: '#38BDF8',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#0F172A',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
                    }}
                >
                    <RefreshCcw size={20} />
                    REFREEZE STATE
                </motion.button>

            </div>
        </div>
    );
};

export default TheRepair;
