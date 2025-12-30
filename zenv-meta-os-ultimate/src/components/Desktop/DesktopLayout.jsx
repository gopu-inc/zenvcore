import React from 'react';
import { useOS } from '../../kernel/OSContext';
import { motion } from 'framer-motion';
import { X, Minus, Square, Package, Terminal, User } from 'lucide-react';
import StoreApp from '../../apps/StoreApp';
import TerminalApp from '../../apps/TerminalApp';

// Window Component
const Window = ({ app }) => {
    const { closeApp, focusApp, activeApp } = useOS();
    const isActive = activeApp === app.id;
    
    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onMouseDown={() => focusApp(app.id)}
            className={`absolute w-[800px] h-[500px] bg-[#1e1e1e] rounded-lg shadow-2xl overflow-hidden flex flex-col border ${isActive ? 'border-blue-500 z-50' : 'border-gray-700 z-10'}`}
            style={{ top: 100, left: 100 }}
        >
            <div className={`h-8 flex items-center justify-between px-2 ${isActive ? 'bg-[#333]' : 'bg-[#222]'}`}>
                <span className="text-xs ml-2">{app.id}</span>
                <div className="flex gap-2">
                    <button onClick={() => closeApp(app.id)} className="hover:bg-red-500 p-1 rounded"><X size={12}/></button>
                </div>
            </div>
            <div className="flex-1 relative overflow-hidden">
                <app.Component />
            </div>
        </motion.div>
    );
};

export const DesktopLayout = () => {
    const { apps, openApp } = useOS();

    return (
        <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80')] bg-cover relative overflow-hidden">
            {/* Desktop Icons */}
            <div className="p-4 flex flex-col gap-4">
                <div onClick={() => openApp('Store', StoreApp)} className="w-20 flex flex-col items-center gap-1 cursor-pointer hover:bg-white/10 p-2 rounded">
                    <Package size={32} className="text-blue-400"/>
                    <span className="text-white text-xs drop-shadow">Store</span>
                </div>
                <div onClick={() => openApp('Terminal', TerminalApp)} className="w-20 flex flex-col items-center gap-1 cursor-pointer hover:bg-white/10 p-2 rounded">
                    <Terminal size={32} className="text-green-400"/>
                    <span className="text-white text-xs drop-shadow">Term</span>
                </div>
            </div>

            {/* Windows */}
            {apps.map(app => <Window key={app.id} app={app} />)}

            {/* Taskbar */}
            <div className="absolute bottom-0 w-full h-12 bg-win-taskbar backdrop-blur flex items-center px-4 gap-2 z-[9999]">
                <div className="bg-blue-600 p-1 rounded">
                    <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-1.5 h-1.5 bg-white"></div><div className="w-1.5 h-1.5 bg-white"></div>
                        <div className="w-1.5 h-1.5 bg-white"></div><div className="w-1.5 h-1.5 bg-white"></div>
                    </div>
                </div>
                {apps.map(app => (
                    <div key={app.id} className="px-4 py-1 bg-white/10 rounded text-xs text-white border-b-2 border-blue-500">
                        {app.id}
                    </div>
                ))}
            </div>
        </div>
    );
};