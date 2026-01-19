import React from 'react';
import { motion } from 'framer-motion';
import OceanBackground from '../components/OceanBackground';
import Iceberg from '../components/Iceberg';
import MeltButton from '../components/MeltButton';
import { ChevronDown, CloudSun } from 'lucide-react';

const TheSurface = ({ onNavigate, onScrollDown }) => {
    return (
        <div className="full-screen">
            <OceanBackground depth="surface" />

            {/* Weather Indicator */}
            <div style={{ position: 'absolute', top: '40px', left: '30px', opacity: 0.6 }}>
                <CloudSun size={32} color="#0F172A" />
            </div>

            {/* Big Number & Iceberg */}
            <div style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div className="text-mono" style={{
                    fontSize: '56px',
                    color: '#0F172A',
                    fontWeight: 'bold',
                    marginBottom: '-20px',
                    zIndex: 2,
                    textShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}>
                    $412
                </div>

                <Iceberg size="large" />
            </div>

            {/* Navigation Hint */}
            <motion.button
                onClick={onScrollDown} // Simulate scroll
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer'
                }}
            >
                <div style={{ fontSize: '12px', marginBottom: '4px' }}>THE ABYSS</div>
                <ChevronDown />
            </motion.button>

            {/* Melt FAB */}
            <MeltButton onClick={() => onNavigate('fracture')} />
        </div>
    );
};

export default TheSurface;
