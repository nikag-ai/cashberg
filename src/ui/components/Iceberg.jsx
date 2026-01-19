import React from 'react';
import { motion } from 'framer-motion';

const Iceberg = ({ health = 'healthy', size = 'medium' }) => {
    // Simple low-poly SVG representation
    // Health determines color/cracks

    const isHealthy = health === 'healthy';
    const fillColor = isHealthy ? '#FFFFFF' : '#E2E8F0';
    const shadowColor = isHealthy ? '#CBD5E1' : '#94A3B8';

    const scale = size === 'large' ? 1.5 : size === 'small' ? 0.8 : 1;

    return (
        <motion.div
            className="floating"
            animate={{
                y: [0, -10, 0],
                rotate: [0, 1, 0, -1, 0]
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            style={{ display: 'inline-block', transformOrigin: 'center bottom' }}
        >
            <svg
                width={200 * scale}
                height={200 * scale}
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Main Body */}
                <path
                    d="M100 20 L160 80 L140 160 L60 160 L40 80 Z"
                    fill={fillColor}
                    stroke={shadowColor}
                    strokeWidth="2"
                    strokeLinejoin="round"
                />

                {/* Facets for Low Poly Look */}
                <path d="M100 20 L100 80 L160 80" fill={fillColor} fillOpacity="0.8" />
                <path d="M100 20 L40 80 L100 80" fill={fillColor} fillOpacity="0.6" />
                <path d="M40 80 L60 160 L100 80" fill={fillColor} fillOpacity="0.4" />
                <path d="M160 80 L140 160 L100 80" fill={fillColor} fillOpacity="0.5" />

                {/* Cracks (Only if not healthy) */}
                {!isHealthy && (
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        d="M80 60 L100 100 L120 70"
                        stroke="#94A3B8"
                        strokeWidth="2"
                    />
                )}
            </svg>
        </motion.div>
    );
};

export default Iceberg;
