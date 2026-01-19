import React from 'react';
import './theme.css';

/**
 * Layout Shell
 * Splits the screen into "Sky" (Top 70%) and "Water" (Bottom 30%) by default.
 * Handles the background transitions.
 */
const Layout = ({ children }) => {
    return (
        <div className="layout-container" style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, var(--sky-gradient-start) 0%, var(--sky-gradient-end) 60%, var(--deep-bg-start) 60%, var(--deep-bg-end) 100%)'
        }}>
            {/* Wave Line Visualization */}
            <div className="water-line" style={{
                position: 'absolute',
                top: '60%',
                left: 0,
                right: 0,
                height: '2px',
                background: 'var(--water-line-color)',
                boxShadow: '0 0 20px var(--water-line-color)',
                opacity: 0.6,
                zIndex: 10
            }} />

            {/* Content Layer */}
            <div className="content-layer" style={{
                position: 'absolute',
                inset: 0,
                overflowY: 'auto', // Allow scrolling within the shell
                zIndex: 20
            }}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
