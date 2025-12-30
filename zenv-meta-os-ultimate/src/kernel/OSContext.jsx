import React, { createContext, useContext, useState, useEffect } from 'react';

const OSContext = createContext(null);

export const OSProvider = ({ children }) => {
  const [device, setDevice] = useState('desktop'); // desktop | mobile
  const [orientation, setOrientation] = useState('landscape');
  const [apps, setApps] = useState([]);
  const [activeApp, setActiveApp] = useState(null);
  const [bootSequence, setBootSequence] = useState(true);

  useEffect(() => {
    // Détection avancée du device
    const checkDevice = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const width = window.innerWidth;
      if (width < 768 || (isTouch && width < 1024)) {
        setDevice('mobile');
      } else {
        setDevice('desktop');
      }
      setOrientation(width > window.innerHeight ? 'landscape' : 'portrait');
    };

    window.addEventListener('resize', checkDevice);
    checkDevice();

    // Simulation Boot
    setTimeout(() => setBootSequence(false), 2500);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const openApp = (id, Component, props = {}) => {
    if (apps.find(a => a.id === id)) {
      setActiveApp(id);
      return;
    }
    setApps(prev => [...prev, { id, Component, props, z: Date.now() }]);
    setActiveApp(id);
  };

  const closeApp = (id) => {
    setApps(prev => prev.filter(a => a.id !== id));
    if (activeApp === id) setActiveApp(null);
  };

  const focusApp = (id) => setActiveApp(id);

  return (
    <OSContext.Provider value={{ device, orientation, apps, activeApp, openApp, closeApp, focusApp, bootSequence }}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => useContext(OSContext);