import React from 'react';
import { useOS } from '../../kernel/OSContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Terminal, User, Battery, Wifi } from 'lucide-react';
import StoreApp from '../../apps/StoreApp';
import TerminalApp from '../../apps/TerminalApp';

export const MobileLayout = () => {
    const { apps, openApp, closeApp } = useOS();
    const activeApp = apps[apps.length - 1]; // Last app is active on mobile (stack)

    const launch = (id, C) => openApp(id, C);

    // Current Time
    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()}`;

    return (
        <div className="h-full w-full bg-black text-white relative overflow-hidden">
            {/* Status Bar */}
            <div className="h-12 pt-2 px-6 flex justify-between items-center z-50 relative">
                <span className="font-bold text-sm">{time}</span>
                <div className="flex gap-2">
                    <Wifi size={16}/>
                    <Battery size={16}/>
                </div>
            </div>

            {/* Home Screen (Grid) */}
            <div className="p-6 grid grid-cols-4 gap-6 mt-10">
                <div onClick={() => launch('Store', StoreApp)} className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                        <Package size={32}/>
                    </div>
                    <span className="text-xs">Store</span>
                </div>
                <div onClick={() => launch('Term', TerminalApp)} className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                        <Terminal size={32}/>
                    </div>
                    <span className="text-xs">Term</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <User size={32}/>
                    </div>
                    <span className="text-xs">Profile</span>
                </div>
            </div>

            {/* App Overlay (Full Screen Slide Up) */}
            <AnimatePresence>
                {activeApp && (
                    <motion.div 
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute inset-0 bg-black z-40 flex flex-col"
                    >
                        <div className="h-1 pt-2 flex justify-center">
                            <div className="w-10 h-1 bg-gray-700 rounded-full"></div>
                        </div>
                        <div className="flex-1 mt-2 rounded-t-3xl overflow-hidden bg-gray-900 border-t border-gray-800 relative">
                            {/* App Content */}
                            <activeApp.Component />
                            
                            {/* Home Indicator / Close Gesture Zone */}
                            <div 
                                className="absolute bottom-0 w-full h-10 flex justify-center items-center z-50 bg-gradient-to-t from-black/80 to-transparent"
                                onClick={() => closeApp(activeApp.id)}
                            >
                                <div className="w-32 h-1.5 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dock */}
            <div className="absolute bottom-4 left-4 right-4 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-evenly px-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl"></div>
                <div className="w-12 h-12 bg-white rounded-xl"></div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl"></div>
                <div className="w-12 h-12 bg-red-500 rounded-xl"></div>
            </div>
        </div>
    );
};