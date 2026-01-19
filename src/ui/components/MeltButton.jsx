import React from 'react';
import { motion } from 'framer-motion';
import { Minus } from 'lucide-react';

const MeltButton = ({ onClick }) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
                boxShadow: [
                    "0 0 0 0 rgba(255, 107, 107, 0.4)",
                    "0 0 0 10px rgba(255, 107, 107, 0)",
                ],
            }}
            transition={{
                boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                }
            }}
            style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-action-melt)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'absolute',
                bottom: '32px',
                right: '32px',
                zIndex: 10,
                color: 'white'
            }}
        >
            <Minus size={32} strokeWidth={3} />
        </motion.button>
    );
};

export default MeltButton;
