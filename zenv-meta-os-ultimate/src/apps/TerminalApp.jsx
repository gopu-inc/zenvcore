import React, {useEffect, useRef} from 'react';
import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export default function TerminalApp() {
    const ref = useRef(null);
    useEffect(() => {
        const term = new Terminal({theme: {background: '#000'}, fontSize: 14});
        const fit = new FitAddon();
        term.loadAddon(fit);
        term.open(ref.current);
        fit.fit();
        term.writeln('\x1b[32mZenv Meta Kernel 2.0.5\x1b[0m');
        term.write('$ ');
        term.onData(d => {
            term.write(d);
            if(d==='\r') term.write('\n$ ');
        });
        window.addEventListener('resize', ()=>fit.fit());
    }, []);
    return <div className="h-full bg-black" ref={ref}/>;
}