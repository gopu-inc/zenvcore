import React, { useEffect, useState } from 'react';
import { PackageService, HealthService } from '../services/api';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { Search, Package, ServerCrash, RefreshCw } from 'lucide-react';

const Packages = () => {
  const [pkgs, setPkgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');

  const fetchPkgs = async (q = '') => {
    setLoading(true);
    setError('');
    
    try {
        const res = q ? await PackageService.search(q) : await PackageService.getAll();
        // L'API peut renvoyer { packages: [...] } ou directement [...]
        const data = res.data.packages || res.data || [];
        setPkgs(Array.isArray(data) ? data : []);
        setServerStatus('online');
    } catch (e) { 
        console.error(e);
        setError('Impossible de joindre le serveur. Il est peut-être en veille (Render Free Tier).');
        setServerStatus('offline');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { 
      // Petit check de santé d'abord
      HealthService.check()
        .then(() => fetchPkgs())
        .catch(() => {
            setError("Le serveur Zenv démarre... Cela peut prendre 1 minute.");
            // On essaie quand même de charger les paquets après 2s
            setTimeout(() => fetchPkgs(), 2000);
        });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPkgs(query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold">Packages</h1>
                {serverStatus === 'online' && <span className="text-green-500 text-xs flex items-center gap-1">● Server Online</span>}
                {serverStatus === 'offline' && <span className="text-red-500 text-xs flex items-center gap-1">● Server Offline/Sleeping</span>}
            </div>
            
            <form onSubmit={handleSearch} className="relative w-full md:w-96">
                <input 
                    className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-primary outline-none text-white"
                    placeholder="Search packages..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            </form>
        </div>

        {error && (
            <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg text-red-200 mb-6 flex items-center gap-3">
                <ServerCrash />
                <div>
                    <p className="font-bold">Erreur de connexion</p>
                    <p className="text-sm">{error}</p>
                    <button onClick={() => fetchPkgs(query)} className="mt-2 bg-red-600 px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-red-500">
                        <RefreshCw size={12}/> Réessayer
                    </button>
                </div>
            </div>
        )}

        {loading ? (
            <div className="text-center py-20">
                <Loader />
                <p className="text-gray-500 mt-4 animate-pulse">Connexion au Hub Zenv...</p>
                <p className="text-xs text-gray-600 mt-2">Si c'est le premier accès, attendez 50s (Render Cold Start)</p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pkgs.length > 0 ? pkgs.map(p => (
                    <Link key={p.name} to={`/packages/${p.name}`} className="bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-all block">
                        <div className="flex justify-between mb-4">
                            <div className="p-2 bg-primary/10 text-primary rounded"><Package /></div>
                            <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">v{p.version}</span>
                        </div>
                        <h2 className="font-bold text-lg mb-1 text-white">{p.name}</h2>
                        <p className="text-sm text-gray-400 line-clamp-2">{p.description || 'Aucune description'}</p>
                        <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500 flex justify-between">
                            <span>{p.author || 'Inconnu'}</span>
                            <span>{p.downloads_count || 0} dl</span>
                        </div>
                    </Link>
                )) : (
                    !error && <div className="col-span-3 text-center py-10 text-gray-500">Aucun package trouvé.</div>
                )}
            </div>
        )}
    </div>
  );
};
export default Packages;