import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FractureKeypad from '../components/FractureKeypad';
import { Coffee, Car, Home, ShoppingBag, X } from 'lucide-react';

const TheFracture = ({ onClose }) => {
    const [amount, setAmount] = useState('0');

    const handlePress = (val) => {
        if (val === 'del') {
            setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        } else {
            setAmount(prev => prev === '0' ? String(val) : prev + val);
        }
    };

    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(2, 6, 23, 0.95)',
                backdropFilter: 'blur(10px)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                padding: '24px'
            }}
        >
            {/* Drag Handle / Close */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', position: 'relative' }}>
                <div onClick={onClose} style={{
                    width: '60px',
                    height: '6px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '3px',
                    cursor: 'pointer'
                }} />
            </div>

            {/* Input Display */}
            <div style={{ textAlign: 'center', marginBottom: '40px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="text-mono" style={{ fontSize: '64px', color: '#FFF' }}>
                    ${amount}
                </div>
                <div style={{ color: '#94A3B8', marginTop: '16px' }}>
                    New Tip will be: <span style={{ color: '#EF4444' }}>${412 - parseFloat(amount)}</span>
                </div>
            </div>

            {/* Category Scroller (Static Demo) */}
            <div style={{
                display: 'flex',
                gap: '24px',
                justifyContent: 'center',
                marginBottom: '32px'
            }}>
                {[Coffee, Car, Home, ShoppingBag].map((Icon, i) => (
                    <div key={i} style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: i === 0 ? 'var(--color-surface-end)' : 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: i === 0 ? 'black' : 'white'
                    }}>
                        <Icon size={20} />
                    </div>
                ))}
            </div>

            {/* Keypad */}
            <FractureKeypad onKeyPress={handlePress} />

            {/* Melt It Button */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                style={{
                    marginTop: '32px',
                    width: '100%',
                    padding: '20px',
                    background: 'var(--color-action-melt)',
                    border: 'none',
                    borderRadius: '16px',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
                Melt It
            </motion.button>

        </motion.div>
    );
};

export default TheFracture;
