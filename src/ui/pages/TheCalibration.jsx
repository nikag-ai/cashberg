import React, { useState } from 'react';
import { motion } from 'framer-motion';
import OceanBackground from '../components/OceanBackground';
import Iceberg from '../components/Iceberg';
import WaterSlider from '../components/WaterSlider';
import GlassContainer from '../components/GlassContainer';

const TheCalibration = ({ onComplete }) => {
    const [totalMass, setTotalMass] = useState(5000);
    const [waterLevel, setWaterLevel] = useState(2500); // Maps to expenses/commitments?

    // Safe Tip = Total Mass - WaterLevel (expenses)
    const safeTip = totalMass - waterLevel;

    return (
        <div className="full-screen">
            <OceanBackground depth="surface" />

            {/* Input Display (Top) */}
            <GlassContainer style={{
                position: 'absolute',
                top: '40px',
                left: '20px',
                right: '20px',
                padding: '16px',
                textAlign: 'center'
            }}>
                <span style={{ color: '#64748B', fontSize: '14px', display: 'block' }}>TOTAL MASS</span>
                <span className="text-mono" style={{ fontSize: '24px', color: '#0F172A' }}>
                    $5,000
                </span>
            </GlassContainer>

            {/* Hero Iceberg */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Iceberg size="large" />

                <motion.div
                    key={safeTip}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel"
                    style={{
                        marginTop: '0px', // Overlap slightly
                        padding: '12px 24px',
                        borderRadius: '16px',
                        textAlign: 'center'
                    }}
                >
                    <div style={{ fontSize: '12px', color: '#64748B' }}>SAFE TIP</div>
                    <div className="text-mono" style={{ fontSize: '32px', color: '#0F172A', fontWeight: 'bold' }}>
                        ${safeTip}
                    </div>
                </motion.div>
            </div>

            {/* Water Slider */}
            <WaterSlider
                value={waterLevel}
                onChange={setWaterLevel} // In a real app this would hook up to the drag
                max={5000}
            />

            {/* Commit Button */}
            <motion.button
                onClick={onComplete}
                whileTap={{ scale: 0.95 }}
                style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#0F172A',
                    color: 'white',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '30px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)'
                }}
            >
                Freeze This State
            </motion.button>
        </div>
    );
};

export default TheCalibration;
