import React from 'react';
import { motion } from 'framer-motion';

const OceanBackground = ({ depth = 'surface' }) => {
    const gradients = {
        surface: 'linear-gradient(to bottom, var(--color-surface-start), var(--color-surface-end))',
        deep: 'linear-gradient(to bottom, var(--color-deep-start), var(--color-deep-end))'
    };

    return (
        <motion.div
            initial={false}
            animate={{
                background: depth === 'deep' ? gradients.deep : gradients.surface
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1
            }}
        />
    );
};

export default OceanBackground;
