import React, { useState } from 'react';
import { Window } from './components/OS/Window';
import BrowserApp from './apps/BrowserApp';
import AccountApp from './apps/AccountApp';
import TerminalApp from './apps/TerminalApp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Package, User, Terminal as TermIcon, Disc } from 'lucide-react';

export default function App() {
  const [windows, setWindows] = useState({
    browser: { isOpen: true, z: 1, title: 'Zenv Explorer', icon: Package, component: <BrowserApp /> },
    account: { isOpen: false, z: 2, title: 'Compte & Settings', icon: User, component: <AccountApp /> },
    terminal: { isOpen: false, z: 3, title: 'Terminal', icon: TermIcon, component: <TerminalApp /> }
  });

  const openWindow = (key) => {
    setWindows(prev => ({
        ...prev,
        [key]: { ...prev[key], isOpen: true, z: Math.max(...Object.values(prev).map(w => w.z)) + 1 }
    }));
  };

  const closeWindow = (key) => {
    setWindows(prev => ({ ...prev, [key]: { ...prev[key], isOpen: false } }));
  };

  const focusWindow = (key) => {
    setWindows(prev => ({
        ...prev,
        [key]: { ...prev[key], z: Math.max(...Object.values(prev).map(w => w.z)) + 1 }
    }));
  };

  return (
    <div className="h-screen w-screen bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center overflow-hidden relative font-sans text-sm selection:bg-blue-500 selection:text-white">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      
      {/* WINDOWS */}
      {Object.entries(windows).map(([key, win]) => (
        <Window 
            key={key} 
            id={key}
            title={win.title}
            icon={win.icon}
            isOpen={win.isOpen}
            isActive={win.z === Math.max(...Object.values(windows).map(w => w.z))}
            onClose={() => closeWindow(key)}
            onFocus={() => focusWindow(key)}
        >
            {win.component}
        </Window>
      ))}

      {/* TASKBAR */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-4 z-[100] shadow-2xl">
        <button onClick={() => openWindow('browser')} className="p-3 bg-blue-600/20 hover:bg-blue-600 rounded-xl transition-all group relative">
            <Package className="text-blue-400 group-hover:text-white" />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Explorer</span>
        </button>
        <button onClick={() => openWindow('terminal')} className="p-3 bg-gray-800/50 hover:bg-gray-700 rounded-xl transition-all group relative">
            <TermIcon className="text-green-400 group-hover:text-white" />
             <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Terminal</span>
        </button>
        <button onClick={() => openWindow('account')} className="p-3 bg-purple-600/20 hover:bg-purple-600 rounded-xl transition-all group relative">
            <User className="text-purple-400 group-hover:text-white" />
             <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Mon Compte</span>
        </button>
      </div>

      <ToastContainer theme="dark" position="top-right" />
    </div>
  );
}