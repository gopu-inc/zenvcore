import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { PackageService } from '../services/api';

const XTerminal = () => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const commandRef = useRef('');
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  // État du système simulé
  const sysState = useRef({
    zenvLangInstalled: false,
    zenvCoreInstalled: false
  });

  useEffect(() => {
    // Initialisation XTerm
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: '"Menlo", "Consolas", "Courier New", monospace',
      fontSize: 14,
      theme: {
        background: '#0a0a0a',
        foreground: '#f0f0f0',
        cursor: '#22c55e',
        selectionBackground: '#22c55e44'
      },
      rows: 16
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    if (terminalRef.current) {
      term.open(terminalRef.current);
      fitAddon.fit();
    }

    xtermRef.current = term;

    // Prompt
    const prompt = () => {
        term.write('\r\n\x1b[1;32muser@mobile\x1b[0m:\x1b[1;34m~\x1b[0m$ ');
    };

    term.writeln('\x1b[1;36mZenv Hub Environment v3.0.0\x1b[0m');
    term.writeln('Connected to https://zenv-hub.onrender.com');
    term.writeln('Type \x1b[1;33mhelp\x1b[0m to list commands.');
    prompt();

    // Gestion Clavier
    term.onData(e => {
      switch (e) {
        case '\r': // Enter
          term.write('\r\n');
          processCommand(commandRef.current.trim());
          commandRef.current = '';
          break;
        case '\u007F': // Backspace
          if (commandRef.current.length > 0) {
            commandRef.current = commandRef.current.slice(0, -1);
            term.write('\b \b');
          }
          break;
        default:
          if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E)) {
             commandRef.current += e;
             term.write(e);
          }
      }
    });

    const processCommand = async (cmd) => {
        const parts = cmd.split(' ');
        const main = parts[0];
        const arg1 = parts[1];
        const arg2 = parts[2];

        switch (main) {
            case '':
                break;
            case 'help':
                term.writeln('Available binaries:');
                term.writeln('  pip     Python Package Installer');
                term.writeln('  zenv    Zenv Base CLI');
                term.writeln('  znv     Zenv Core Logic');
                term.writeln('  clear   Clear terminal');
                break;
            
            case 'clear':
                term.clear();
                break;

            case 'pip':
                if (arg1 === 'install' && arg2 === 'zenv-lang') {
                    term.writeln('Collecting zenv-lang...');
                    term.writeln('Downloading zenv-lang-1.0.tar.gz (15 kB)');
                    await delay(500);
                    term.writeln('Installing collected packages: zenv-lang');
                    term.writeln('Successfully installed zenv-lang-1.0.0');
                    sysState.current.zenvLangInstalled = true;
                } else {
                    term.writeln('Usage: pip install zenv-lang');
                }
                break;

            case 'zenv':
                if (!sysState.current.zenvLangInstalled) {
                    term.writeln('bash: zenv: command not found (Install with pip first)');
                    break;
                }
                if (arg1 === 'install' && arg2 === 'zenv[core]') {
                    term.writeln('Resolving dependencies for zenv[core]...');
                    await delay(600);
                    term.writeln('Fetching core manifest from hub...');
                    term.writeln('Extracting core binaries...');
                    sysState.current.zenvCoreInstalled = true;
                    term.writeln('\x1b[32mSuccess: zenv core installed. "znv" alias created.\x1b[0m');
                } else {
                    term.writeln('Usage: zenv install zenv[core]');
                }
                break;

            case 'znv':
                if (!sysState.current.zenvCoreInstalled) {
                    term.writeln('bash: znv: command not found (Core not installed)');
                    break;
                }
                if (arg1 === 'search') {
                    if (!arg2) { term.writeln('Usage: znv search <query>'); break; }
                    term.writeln(`Searching Hub for "${arg2}"...`);
                    try {
                        const res = await PackageService.search(arg2);
                        if (res.data.packages && res.data.packages.length > 0) {
                            res.data.packages.forEach(p => {
                                term.writeln(`* ${p.name} (v${p.version})`);
                            });
                        } else {
                            term.writeln('No packages found.');
                        }
                    } catch (err) {
                        term.writeln('Error connecting to Hub API.');
                    }
                } else if (arg1 === 'version') {
                    term.writeln('Zenv Core v2.2.0 (Build 2025)');
                } else {
                    term.writeln('Unknown znv command. Try: search');
                }
                break;

            default:
                term.writeln(`bash: ${main}: command not found`);
        }
        prompt();
    };

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    return () => term.dispose();
  }, []);

  return <div ref={terminalRef} className="w-full h-full" />;
};

export default XTerminal;