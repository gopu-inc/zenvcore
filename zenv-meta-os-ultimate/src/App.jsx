import React from 'react';
import { OSProvider, useOS } from './kernel/OSContext';
import { DesktopLayout } from './components/Desktop/DesktopLayout';
import { MobileLayout } from './components/Mobile/MobileLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BootLoader = () => (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-20 h-20 border-4 border-t-blue-500 border-gray-800 rounded-full animate-spin mb-6"></div>
        <h1 className="text-2xl font-bold tracking-[0.5em] animate-pulse">ZENV META OS</h1>
        <p className="text-xs text-gray-500 mt-4 font-mono">Loading Kernel Modules (2000+)...</p>
    </div>
);

const System = () => {
    const { device, bootSequence } = useOS();

    if (bootSequence) return <BootLoader />;

    return (
        <>
            {device === 'mobile' ? <MobileLayout /> : <DesktopLayout />}
            <ToastContainer theme="dark" />
        </>
    );
};

export default function App() {
    return (
        <OSProvider>
            <System />
        </OSProvider>
    );
}