import React, { useState } from 'react';
import { useAuth } from '../../connectors/hooks';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Need direct access or expose via hook

const TheDive = ({ auth }) => { // auth passed from App, or use hook
    const { login } = useAuth(); // We need a way to Signup too
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState('LOGIN'); // 'LOGIN' or 'SIGNUP'
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // We need to access auth instance for signup since hook doesn't expose it
    // Or we can expand the hook. Let's expand the hook in a sec, 
    // but for now, we can try to use login() if it was generic? 
    // No, login is signInWithEmailAndPassword.
    // I'll grab auth from props or context? 
    // In App.jsx, useAuth is used. Let's update `hooks.js` to expose signup.

    return (
        <div className="view-deep" style={{
            height: '100vh',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            <h1 className="text-huge" style={{ marginBottom: '40px', color: 'white' }}>THE DIVE</h1>

            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '30px' }}>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                        display: 'block', width: '100%', padding: '15px', marginBottom: '15px',
                        borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.9)'
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{
                        display: 'block', width: '100%', padding: '15px', marginBottom: '20px',
                        borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.9)'
                    }}
                />

                <button
                    onClick={async () => {
                        setLoading(true);
                        setError(null);
                        try {
                            if (mode === 'LOGIN') {
                                await login(email, password);
                            } else {
                                // Use exposed signup from prop or expanded hook
                                // Assuming App.jsx passes a signup handler or we use a direct import
                                // Let's use direct import for cleaner code here if hook doesn't have it
                                const { getAuth, createUserWithEmailAndPassword } = await import('firebase/auth');
                                const { getApp } = await import('firebase/app');
                                const authInstance = getAuth(getApp());
                                await createUserWithEmailAndPassword(authInstance, email, password);
                            }
                        } catch (e) {
                            setError(e.message);
                        } finally {
                            setLoading(false);
                        }
                    }}
                    className="glass-card-dark"
                    style={{
                        width: '100%', padding: '15px',
                        color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? '...' : (mode === 'LOGIN' ? 'ENTER DEEP' : 'CREATE ID')}
                </button>

                <div style={{ marginTop: '20px', textAlign: 'center', color: 'white', cursor: 'pointer' }}
                    onClick={() => setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                >
                    {mode === 'LOGIN' ? 'Need an ID?' : 'Have an ID?'}
                </div>
            </div>
        </div>
    );
};
export default TheDive;
