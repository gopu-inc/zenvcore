import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const TerminalApp = () => {
    const termRef = useRef(null);
    
    useEffect(() => {
        const term = new Terminal({
            theme: { background: '#0a0a0a' },
            fontFamily: 'monospace',
            cursorBlink: true
        });
        const fit = new FitAddon();
        term.loadAddon(fit);
        term.open(termRef.current);
        fit.fit();
        
        term.writeln('\x1b[32mZenvOS v4.0.0\x1b[0m');
        term.writeln('Welcome to the Zenv Virtual Environment.');
        term.write('\r\n$ ');
        
        term.onData(e => {
            if(e === '\r') term.write('\r\n$ ');
            else term.write(e);
        });

        const handleResize = () => fit.fit();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            term.dispose();
        }
    }, []);

    return <div className="h-full w-full bg-[#0a0a0a]" ref={termRef} />;
};
export default TerminalApp;