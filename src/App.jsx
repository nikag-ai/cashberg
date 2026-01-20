import React from 'react';
import { DataProvider } from './connectors/DataProvider';
import { AppStoreProvider, useAppStore } from '@/store/appStore';
import { Toaster } from "@/components/ui/sonner";

// New Screens
import { DiveScreen } from '@/components/screens/DiveScreen';
// import { CalibrationScreen } from '@/components/screens/CalibrationScreen'; // Need to verify if this exists and name match
import { CalibrationScreen } from '@/components/screens/CalibrationScreen';
import { SurfaceScreen } from '@/components/screens/SurfaceScreen';
import { AbyssScreen } from '@/components/screens/AbyssScreen';
import { StreamScreen } from '@/components/screens/StreamScreen';
import { RepairScreen } from '@/components/screens/RepairScreen';

// Main Render Logic
const CashbergOS = () => {
    const { currentScreen, loading } = useAppStore();

    if (loading.auth) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
                <div className="animate-pulse">Loading Cashberg OS...</div>
            </div>
        );
    }

    // New Screen Router
    const renderScreen = () => {
        switch (currentScreen) {
            case 'dive': return <DiveScreen />;
            case 'calibration': return <CalibrationScreen />;
            case 'surface': return <SurfaceScreen />;
            case 'abyss': return <AbyssScreen />;
            case 'stream': return <StreamScreen />;
            case 'repair': return <RepairScreen />;
            default: return <DiveScreen />;
        }
    };

    return (
        <>
            {renderScreen()}
            <Toaster />
        </>
    );
};

// Application Root
function App() {
    return (
        <DataProvider>
            <AppStoreProvider>
                <CashbergOS />
            </AppStoreProvider>
        </DataProvider>
    );
}

export default App;
