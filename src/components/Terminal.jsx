import React, { useState, useEffect, useRef } from 'react';
import { PackageService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ZenvTerminal = () => {
  const [history, setHistory] = useState([
    { type: 'info', content: 'Zenv Core v2.2.0 - Connected to Hub' },
    { type: 'info', content: 'Type "help" for available commands.' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = async (cmd) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    
    // Ajout commande à l'historique
    setHistory(prev => [...prev, { type: 'command', content: `zenv ${cmd}` }]);
    setIsProcessing(true);

    try {
      switch (command) {
        case 'help':
          setHistory(prev => [...prev, { 
            type: 'success', 
            content: `
Available commands:
  install <package>   Install a package (simulation)
  search <query>      Search packages on Hub
  info <package>      Get package details
  login               Go to login page
  clear               Clear terminal
  version             Show version
            ` 
          }]);
          break;

        case 'clear':
          setHistory([]);
          break;

        case 'version':
          setHistory(prev => [...prev, { type: 'info', content: 'zenv-cli v2.0.0 (python3)' }]);
          break;

        case 'login':
          setHistory(prev => [...prev, { type: 'info', content: 'Redirecting to login...' }]);
          setTimeout(() => navigate('/login'), 1000);
          break;

        case 'search':
          if (!args[1]) {
            setHistory(prev => [...prev, { type: 'error', content: 'Usage: search <query>' }]);
            break;
          }
          setHistory(prev => [...prev, { type: 'info', content: `Searching for "${args[1]}"...` }]);
          try {
            // Utilisation réelle de l'API ici si possible, sinon fallback mockup pour la démo
            const res = await PackageService.search(args[1]).catch(() => null);
            if (res && res.data && res.data.packages) {
                const results = res.data.packages.map(p => `• ${p.name} (v${p.version}) - ${p.description}`).join('\n');
                setHistory(prev => [...prev, { type: 'success', content: results || 'No results found.' }]);
            } else {
                setHistory(prev => [...prev, { type: 'warning', content: 'No packages found matching query.' }]);
            }
          } catch (e) {
            setHistory(prev => [...prev, { type: 'error', content: 'Connection failed.' }]);
          }
          break;

        case 'install':
          if (!args[1]) {
            setHistory(prev => [...prev, { type: 'error', content: 'Usage: install <package>' }]);
            break;
          }
          const pkg = args[1];
          setHistory(prev => [...prev, { type: 'info', content: `Resolving ${pkg}...` }]);
          
          // Simulation d'installation avec délai
          setTimeout(() => {
             setHistory(prev => [...prev, { type: 'info', content: `Downloading ${pkg}-latest.zv...` }]);
             setTimeout(() => {
                 setHistory(prev => [...prev, { type: 'info', content: `Extracting...` }]);
                 setTimeout(() => {
                     setHistory(prev => [...prev, { type: 'success', content: `✅ Successfully installed ${pkg}` }]);
                     setIsProcessing(false);
                 }, 800);
             }, 800);
          }, 800);
          return; // Return early because we handle processing state in timeout

        case 'info':
            if (!args[1]) {
                setHistory(prev => [...prev, { type: 'error', content: 'Usage: info <package>' }]);
                break;
            }
            navigate(`/packages/${args[1]}`);
            setHistory(prev => [...prev, { type: 'info', content: 'Opening package details...' }]);
            break;

        default:
          setHistory(prev => [...prev, { type: 'error', content: `Command not found: ${command}` }]);
      }
    } catch (err) {
      setHistory(prev => [...prev, { type: 'error', content: `Error: ${err.message}` }]);
    }

    setIsProcessing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isProcessing) {
      if (input.trim()) {
        handleCommand(input);
        setInput('');
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-black/90 rounded-lg overflow-hidden shadow-2xl border border-slate-700 font-mono text-sm sm:text-base backdrop-blur-sm">
      <div className="bg-slate-800/50 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-slate-400 text-xs ml-2">user@zenv-hub:~$</div>
      </div>
      
      <div 
        className="p-4 h-[400px] overflow-y-auto cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line, i) => (
          <div key={i} className={`mb-1 whitespace-pre-wrap ${
            line.type === 'error' ? 'text-red-400' :
            line.type === 'success' ? 'text-green-400' :
            line.type === 'warning' ? 'text-yellow-400' :
            line.type === 'command' ? 'text-slate-300 font-bold opacity-80' :
            'text-blue-300'
          }`}>
            {line.type === 'command' ? '$ ' : ''}{line.content}
          </div>
        ))}
        
        <div className="flex items-center text-slate-100">
          <span className="text-green-500 mr-2">$</span>
          <span className="text-blue-400 mr-2">zenv</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="flex-1 bg-transparent outline-none border-none text-white"
            autoFocus
          />
        </div>
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};

export default ZenvTerminal;