import React, { useEffect, useState } from 'react';
import { PackageService } from '../services/api';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { Search, Package, TrendingUp, Calendar, Download, Crown, User } from 'lucide-react';

const Packages = () => {
  const [pkgs, setPkgs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  
  // Stats
  const [topPkg, setTopPkg] = useState(null);
  const [recentPkg, setRecentPkg] = useState(null);

  useEffect(() => {
    const load = async () => {
        setLoading(true);
        try {
            // On récupère tout
            const data = await PackageService.getAll();
            setPkgs(data);
            setFiltered(data);

            // Calcul du Top Package (Le plus téléchargé)
            if (data.length > 0) {
                const sortedByDl = [...data].sort((a, b) => (b.downloads_count || 0) - (a.downloads_count || 0));
                setTopPkg(sortedByDl[0]);

                // Calcul du plus récent
                // On suppose qu'il y a un champ updated_at, sinon on prend le dernier de la liste
                const sortedByDate = [...data].sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
                setRecentPkg(sortedByDate[0]);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };
    load();
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setQuery(q);
    setFiltered(pkgs.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* HEADER STATS */}
        {!loading && pkgs.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
                {/* CARTE DU ROI (TOP DOWNLOAD) */}
                {topPkg && (
                    <div className="bg-gradient-to-br from-yellow-900/40 to-black border border-yellow-600/30 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Crown size={100} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-yellow-500 mb-2 font-bold uppercase tracking-widest text-xs">
                                <Crown size={16}/> Le plus populaire
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2">{topPkg.name}</h2>
                            <p className="text-gray-300 line-clamp-2 mb-4">{topPkg.description}</p>
                            <div className="flex items-center gap-4 text-sm text-yellow-200/80 mb-6">
                                <span className="flex items-center gap-1"><Download size={16}/> {topPkg.downloads_count} téléchargements</span>
                                <span className="flex items-center gap-1"><User size={16}/> {topPkg.author}</span>
                            </div>
                            <Link to={`/packages/${topPkg.name}`} className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition-colors">
                                Voir le Champion
                            </Link>
                        </div>
                    </div>
                )}

                {/* CARTE TENDANCE (RÉCENT) */}
                {recentPkg && (
                    <div className="bg-gradient-to-br from-blue-900/40 to-black border border-blue-600/30 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                            <TrendingUp size={100} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-blue-400 mb-2 font-bold uppercase tracking-widest text-xs">
                                <TrendingUp size={16}/> Dernière Sortie
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2">{recentPkg.name}</h2>
                            <p className="text-gray-300 line-clamp-2 mb-4">{recentPkg.description}</p>
                            <div className="flex items-center gap-4 text-sm text-blue-200/80 mb-6">
                                <span className="flex items-center gap-1"><Calendar size={16}/> v{recentPkg.version}</span>
                                <span className="bg-blue-500/20 px-2 py-0.5 rounded text-blue-300 text-xs">Nouveau</span>
                            </div>
                            <Link to={`/packages/${recentPkg.name}`} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                Découvrir
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* BARRE DE RECHERCHE */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 sticky top-20 z-30 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-border">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Package className="text-gray-500"/> Explorateur
                <span className="bg-gray-800 text-xs text-gray-400 px-2 py-1 rounded-full">{filtered.length}</span>
            </h1>
            <div className="relative w-full md:w-96">
                <input 
                    className="w-full bg-[#18181b] border border-border rounded-lg pl-10 pr-4 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Python, Web, Utils..."
                    value={query}
                    onChange={handleSearch}
                />
                <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
            </div>
        </div>

        {/* GRILLE DE PAQUETS */}
        {loading ? <Loader /> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(p => (
                    <Link key={p.name} to={`/packages/${p.name}`} className="bg-[#18181b] border border-[#27272a] p-6 rounded-xl hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all group flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-lg group-hover:scale-110 transition-transform">
                                <Package size={24} />
                            </div>
                            <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded font-mono">v{p.version}</span>
                        </div>
                        
                        <h2 className="font-bold text-xl mb-2 text-white group-hover:text-primary transition-colors">{p.name}</h2>
                        <p className="text-sm text-gray-400 mb-6 flex-grow line-clamp-3">{p.description || "Aucune description fournie par l'auteur."}</p>
                        
                        <div className="pt-4 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500">
                             <div className="flex items-center gap-1">
                                <User size={12}/> {p.author || 'Inconnu'}
                             </div>
                             <div className="flex items-center gap-1">
                                <Download size={12}/> {p.downloads_count || 0}
                             </div>
                        </div>
                    </Link>
                ))}
                
                {filtered.length === 0 && !loading && (
                    <div className="col-span-full py-20 text-center text-gray-500">
                        Aucun paquet ne correspond à "{query}".
                    </div>
                )}
            </div>
        )}
    </div>
  );
};
export default Packages;