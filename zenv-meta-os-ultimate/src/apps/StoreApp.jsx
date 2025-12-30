import React, {useState, useEffect} from 'react';
import {ZenvAPI} from '../services/api';
import {Search, Package, Download} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function StoreApp() {
    const [pkgs, setPkgs] = useState([]);
    const [view, setView] = useState('grid');
    const [sel, setSel] = useState(null);
    const [readme, setReadme] = useState('');

    useEffect(() => { ZenvAPI.getPackages().then(setPkgs); }, []);

    const open = async (p) => {
        setSel(p); setView('detail');
        try { const r = await ZenvAPI.getReadme(p.name); setReadme(r.data); } catch { setReadme('No content'); }
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 text-white">
            <div className="p-4 border-b border-gray-800 flex gap-2">
                {view==='detail' && <button onClick={()=>setView('grid')}>Back</button>}
                <input className="bg-black/50 p-2 rounded w-full" placeholder="Search Zenv..."/>
            </div>
            <div className="flex-1 overflow-auto p-4">
                {view === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {pkgs.map(p => (
                            <div key={p.name} onClick={()=>open(p)} className="bg-gray-800 p-4 rounded-xl active:scale-95 transition-transform">
                                <div className="flex justify-between">
                                    <h3 className="font-bold">{p.name}</h3>
                                    <span className="text-xs bg-blue-600 px-2 rounded">v{p.version}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{p.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col">
                        <h1 className="text-2xl font-bold mb-4">{sel.name}</h1>
                        <div className="flex-1 bg-black rounded p-4 overflow-auto prose prose-invert">
                            {readme.includes('<html') ? <iframe srcDoc={readme} className="w-full h-full border-0"/> : <ReactMarkdown>{readme}</ReactMarkdown>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}