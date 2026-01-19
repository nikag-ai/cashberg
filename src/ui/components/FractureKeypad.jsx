import React from 'react';
import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';

const Key = ({ value, onClick, accent = false }) => (
    <motion.button
        whileTap={{ scale: 0.9, backgroundColor: 'rgba(255,255,255,0.2)' }}
        onClick={() => onClick(value)}
        style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            fontSize: '24px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
    >
        {value}
    </motion.button>
);

const FractureKeypad = ({ onKeyPress }) => {
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'del'];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            justifyItems: 'center',
            marginTop: '40px'
        }}>
            {keys.map((k) => (
                <Key
                    key={k}
                    value={k === 'del' ? <Delete size={24} /> : k}
                    onClick={() => onKeyPress(k)}
                />
            ))}
        </div>
    );
};

export default FractureKeypad;
