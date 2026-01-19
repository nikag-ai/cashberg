import React from 'react';
import { motion } from 'framer-motion';
import '../theme.css';

const GlassContainer = ({ children, className = '', ...props }) => {
    return (
        <motion.div
            className={`glass-panel ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
                borderRadius: '24px',
                padding: '24px',
                ...props.style
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassContainer;
