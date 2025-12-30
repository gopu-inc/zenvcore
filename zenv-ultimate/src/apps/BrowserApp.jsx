import React, { useState, useEffect } from 'react';
import { API } from '../../services/api';
import { Search, Package, Download, Terminal, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Composant Magique pour afficher le HTML brut du README
const ReadmeViewer = ({ content }) => {
  // Si c'est du HTML (commence par doctype ou contient <html>)
  if (content.trim().toLowerCase().startsWith('<!doctype') || content.includes('<html')) {
     return (
        <div className="w-full h-full bg-white rounded-lg overflow-hidden border border-gray-700">
            <iframe 
                srcDoc={content} 
                className="w-full h-full" 
                title="Readme"
                sandbox="allow-scripts" // Sécurité
            />
        </div>
     );
  }
  // Sinon Markdown
  return <div className="prose prose-invert max-w-none p-4"><ReactMarkdown>{content}</ReactMarkdown></div>;
};

const BrowserApp = () => {
  const [pkgs, setPkgs] = useState([]);
  const [view, setView] = useState('list'); // list | detail
  const [selected, setSelected] = useState(null);
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPkgs();
  }, []);

  const loadPkgs = async () => {
    setLoading(true);
    const data = await API.getPackages();
    setPkgs(data);
    setLoading(false);
  };

  const openPackage = async (pkg) => {
    setSelected(pkg);
    setView('detail');
    setReadme('Chargement...');
    try {
        const res = await API.getReadme(pkg.name);
        setReadme(res.data || "<h1>Aucun README</h1>");
    } catch {
        setReadme("Erreur de chargement du README");
    }
  };

  return (
    <div className="h-full flex flex-col text-white">
      {/* Toolbar */}
      <div className="h-12 border-b border-gray-800 flex items-center px-4 gap-4 bg-[#1a1a1a]">
        {view === 'detail' && (
            <button onClick={() => setView('list')} className="p-2 hover:bg-gray-700 rounded"><ArrowLeft size={18}/></button>
        )}
        <div className="flex-1 bg-black/50 rounded flex items-center px-3 py-1 border border-gray-700">
            <Search size={14} className="text-gray-500 mr-2"/>
            <input placeholder="Search Zenv Hub..." className="bg-transparent outline-none w-full text-sm"/>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {loading && <div className="text-center p-10">Chargement du Hub...</div>}
        
        {view === 'list' && !loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pkgs.map(p => (
                    <div key={p.name} onClick={() => openPackage(p)} className="bg-[#2d2d2d] p-4 rounded-lg cursor-pointer hover:bg-blue-600/20 hover:border-blue-500 border border-transparent transition-all group">
                        <div className="flex justify-between items-start mb-2">
                            <Package className="text-blue-400 group-hover:scale-110 transition-transform"/>
                            <span className="text-xs bg-black px-2 py-0.5 rounded text-gray-400">v{p.version}</span>
                        </div>
                        <h3 className="font-bold text-lg">{p.name}</h3>
                        <p className="text-gray-400 text-xs line-clamp-2 mt-1">{p.description}</p>
                    </div>
                ))}
            </div>
        )}

        {view === 'detail' && selected && (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">{selected.name}</h1>
                        <p className="text-gray-400">{selected.description}</p>
                    </div>
                    <div className="bg-black p-3 rounded font-mono text-green-400 text-sm border border-gray-700">
                        znv install {selected.name}
                    </div>
                </div>
                
                <div className="flex-1 bg-[#111] rounded-lg border border-gray-800 overflow-hidden">
                    <ReadmeViewer content={readme} />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
export default BrowserApp;