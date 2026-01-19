import React from 'react';
import { motion } from 'framer-motion';
import { Droplet } from 'lucide-react';

const WaterSlider = ({ value, onChange, min = 0, max = 5000 }) => {
    // A custom vertical slider implementation

    const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);

    return (
        <div style={{
            position: 'absolute',
            right: '20px',
            top: '20%',
            bottom: '20%',
            width: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10
        }}>
            {/* Track */}
            <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '2px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '1px'
            }} />

            {/* Thumb Container */}
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 400 }} // Simplified constraint logic, ideal world would measure height
                dragElastic={0}
                dragMomentum={false}
                onDrag={(event, info) => {
                    // Logic to inverse map position to value would go here
                    // For this UI demo, we might just animate visual position based on props if controlled
                    // or emitting changes. To keep it simple for the demo, we assume controlled but visually static for now unless we implement full drag math
                }}
                style={{
                    top: `${(1 - percentage) * 100}%`, // Inverted because bottom is 0? Actually top 0 is usually max. Let's say top is 100% (full tank)
                    position: 'absolute',
                    cursor: 'grab'
                }}
            >
                <div style={{
                    position: 'relative',
                    left: '-12px'
                }}>
                    <Droplet fill="#E0F7FA" color="#020617" size={24} />
                </div>

                {/* Value Label */}
                <div style={{
                    position: 'absolute',
                    right: '30px',
                    top: '-4px',
                    background: 'rgba(0,0,0,0.5)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    color: 'white',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                }}>
                    ${value}
                </div>
            </motion.div>
        </div>
    );
};

export default WaterSlider;
