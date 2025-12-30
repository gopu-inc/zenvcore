import React, { useState } from 'react';
import Terminal from 'react-console-emulator';
import { PackageService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ZenvTerminal = () => {
  const navigate = useNavigate();
  const [hasZenvLang, setHasZenvLang] = useState(false);
  const [hasZenvCore, setHasZenvCore] = useState(false);

  const commands = {
    help: {
      fn: () => `
Available Commands:
  pip install zenv-lang    Install Base CLI
  zenv install zenv[core]  Install Core Logic
  znv <cmd>                Use Zenv (search, info)
  clear                    Clear screen
`
    },
    pip: {
      fn: (...args) => {
        const cmd = args.join(' ');
        if (cmd === 'install zenv-lang') {
          return new Promise((resolve) => {
            setTimeout(() => {
              setHasZenvLang(true);
              resolve('Successfully installed zenv-lang-1.0.0\nBase CLI ready. Type "zenv" to continue.');
            }, 1000);
          });
        }
        return 'Command not found. Try: pip install zenv-lang';
      }
    },
    zenv: {
      fn: (...args) => {
        if (!hasZenvLang) return 'Command not found: zenv';
        
        const cmd = args.join(' ');
        if (cmd === 'install zenv[core]') {
          return new Promise((resolve) => {
            setTimeout(() => {
              setHasZenvCore(true);
              resolve('Successfully installed zenv[core]\nEntrypoint "znv" created.\nYou can now use "znv search <pkg>".');
            }, 1500);
          });
        }
        return 'Usage: zenv install zenv[core]';
      }
    },
    znv: {
      fn: async (...args) => {
        if (!hasZenvCore) return 'Command not found: znv (Install zenv[core] first)';
        
        const action = args[0];
        const query = args[1];

        if (action === 'search') {
          if (!query) return 'Usage: znv search <name>';
          try {
            const res = await PackageService.search(query);
            if (!res.data.packages || res.data.packages.length === 0) return 'No packages found.';
            return res.data.packages.map(p => `• ${p.name} (v${p.version}) - ${p.description}`).join('\n');
          } catch {
            return 'Error connecting to Hub.';
          }
        }
        if (action === 'info') {
             navigate(`/packages/${query}`);
             return 'Opening package page...';
        }
        return 'Available znv commands: search, info';
      }
    },
    apt: { fn: () => 'Command not found: apt' }
  };

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border shadow-2xl">
      <Terminal
        commands={commands}
        welcomeMessage={'Zenv Core v2.2.0 - Connected to Hub\nType "help" for instructions.\n'}
        promptLabel={'user@mobile:~$'}
        inputStyle={{ color: '#fff' }}
        style={{ background: '#18181b', height: '100%' }}
      />
    </div>
  );
};
export default ZenvTerminal;