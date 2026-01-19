import React from 'react';
import { motion } from 'framer-motion';
import OceanBackground from '../components/OceanBackground';
import GlassContainer from '../components/GlassContainer';
import { Search } from 'lucide-react';

const TransactionItem = ({ type, title, date, amount }) => (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', position: 'relative' }}>
        {/* Timeline Node */}
        <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: type === 'debit' ? '#F43F5E' : '#10B981',
            border: '4px solid rgba(255,255,255,0.2)',
            zIndex: 2,
            marginTop: '6px'
        }} />

        <div style={{ flex: 1, borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>{title}</span>
                <span className="text-mono" style={{
                    fontWeight: 600,
                    color: type === 'debit' ? '#BE123C' : '#047857'
                }}>
                    {type === 'debit' ? '-' : '+'}${amount}
                </span>
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{date}</div>
        </div>
    </div>
);

const TheStream = () => {
    // In a real app this would likely overlay or slide over
    return (
        <div className="full-screen" style={{ background: '#F8FAFC' }}>
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h2 style={{ margin: 0, color: '#0F172A' }}>The Stream</h2>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'white',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                    }}>
                        <Search size={20} color="#64748B" />
                    </div>
                </div>

                {/* Timeline Line */}
                <div style={{
                    position: 'absolute',
                    left: '31px',
                    top: '100px',
                    bottom: '0',
                    width: '2px',
                    background: '#E2E8F0',
                    zIndex: 0
                }} />

                {/* List */}
                <div>
                    <TransactionItem type="debit" title="Starbucks Coffee" date="Today, 9:41 AM" amount={5.50} />
                    <TransactionItem type="debit" title="Uber Ride" date="Yesterday" amount={24.20} />
                    <TransactionItem type="credit" title="Paycheck" date="Fri, Dec 15" amount={2400.00} />
                    <TransactionItem type="debit" title="Whole Foods" date="Fri, Dec 15" amount={89.12} />
                </div>
            </div>
        </div>
    );
};

export default TheStream;
