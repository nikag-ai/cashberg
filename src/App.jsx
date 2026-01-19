import React, { useState } from 'react';
import Layout from './ui/core/Layout';
import { DataProvider, useData } from './connectors/DataProvider';

import TheDive from './ui/screens/TheDive';
import TheSurface from './ui/screens/TheSurface';
import TheFracture from './ui/screens/TheFracture';
import TheAbyss from './ui/screens/TheAbyss';
import TheStream from './ui/screens/TheStream';
import TheRepair from './ui/screens/TheRepair';
import TheCalibration from './ui/screens/TheCalibration';

// Inner Component that consumes Data
const CashbergApp = () => {
    const { user, iceberg, loading } = useData();
    const [isMelting, setIsMelting] = useState(false);
    const [screen, setScreen] = useState('surface');

    // Auth Wait
    if (loading.auth) return <div>Auth Loading...</div>;

    // Not Logged In
    if (!user) {
        return (
            <Layout>
                <TheDive />
            </Layout>
        );
    }

    // Checking Calibration (Iceberg Data)
    // Note: If buckets/txns are still loading, that's fine, we can show the app.
    // But we need Iceberg to exist to skip calibration.
    if (loading.iceberg) return <div>Loading Iceberg...</div>;

    // If Logged In but no Iceberg -> Calibration
    if (!iceberg) {
        return (
            <Layout>
                <TheCalibration />
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Main View Area */}
            <div style={{ paddingBottom: '80px' }}>
                {screen === 'surface' && (
                    <TheSurface
                        iceberg={iceberg}
                        onMelt={() => setIsMelting(true)}
                        onDive={() => setScreen('abyss')}
                    />
                )}
                {screen === 'abyss' && <TheAbyss uid={user.uid} onBack={() => setScreen('surface')} />}
                {screen === 'stream' && <TheStream uid={user.uid} onBack={() => setScreen('surface')} />}
                {screen === 'repair' && <TheRepair uid={user.uid} onBack={() => setScreen('surface')} />}
            </div>

            {/* Modals */}
            {isMelting && <TheFracture onClose={() => setIsMelting(false)} />}

            {/* Navigation */}
            <div style={{
                position: 'fixed', bottom: 20, left: 20, right: 20,
                display: 'flex', justifyContent: 'space-around',
                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                borderRadius: '30px', padding: '15px', zIndex: 90
            }}>
                <span onClick={() => setScreen('abyss')} style={{ cursor: 'pointer', opacity: screen === 'abyss' ? 1 : 0.5 }}>🧊</span>
                <span onClick={() => setScreen('surface')} style={{ cursor: 'pointer', opacity: screen === 'surface' ? 1 : 0.5 }}>🏠</span>
                <span onClick={() => setScreen('repair')} style={{ cursor: 'pointer', opacity: screen === 'repair' ? 1 : 0.5 }}>🔧</span>
                <span onClick={() => setScreen('stream')} style={{ cursor: 'pointer', opacity: screen === 'stream' ? 1 : 0.5 }}>📜</span>
            </div>
        </Layout>
    );
};

// Root Wrapper
function App() {
    return (
        <DataProvider>
            <CashbergApp />
        </DataProvider>
    );
}

export default App;
