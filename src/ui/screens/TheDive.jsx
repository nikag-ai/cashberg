import React, { useState } from 'react';
import { useAuth } from '../../connectors/hooks';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Need direct access or expose via hook

const TheDive = ({ auth }) => { // auth passed from App, or use hook
    const { login, loginWithGoogle } = useAuth();
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

                {/* Google Sign In */}
                <div className="text-label" style={{ textAlign: 'center', margin: '20px 0', opacity: 0.5 }}>OR</div>

                <button
                    onClick={async () => {
                        setLoading(true);
                        setError(null);
                        try {
                            await loginWithGoogle();
                        } catch (e) {
                            console.error(e);
                            setError(`${e.code}: ${e.message}`);
                        } finally {
                            setLoading(false);
                        }
                    }}
                    style={{
                        width: '100%', padding: '12px',
                        background: 'white', color: '#555',
                        borderRadius: '10px', border: 'none',
                        fontWeight: 'bold', fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                    }}
                >
                    {/* Simple Google Icon SVG */}
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
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
