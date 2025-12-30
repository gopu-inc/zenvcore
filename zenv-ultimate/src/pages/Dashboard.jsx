import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthService, PackageService } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Key, User, Box, Download, Plus, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [myPackages, setMyPackages] = useState([]);
  const [loadingPkgs, setLoadingPkgs] = useState(true);
  const [stats, setStats] = useState({ downloads: 0, count: 0 });

  useEffect(() => {
    if (user) {
        // Charge les paquets et filtre ceux de l'utilisateur
        PackageService.getAll().then(data => {
            const mine = data.filter(p => p.author === user.username);
            setMyPackages(mine);
            
            // Calcul des stats
            const totalDl = mine.reduce((acc, curr) => acc + (curr.downloads_count || 0), 0);
            setStats({ downloads: totalDl, count: mine.length });
            
            setLoadingPkgs(false);
        }).catch(() => setLoadingPkgs(false));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.info("Déconnexion réussie");
  };

  const genToken = async () => {
    try {
        const res = await AuthService.generateToken();
        setToken(res.data.token);
        toast.success('Nouveau token généré !');
    } catch { toast.error('Erreur lors de la génération'); }
  };

  const copyToken = () => {
      navigator.clipboard.writeText(token);
      toast.success('Copié !');
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 border-b border-gray-800 pb-8">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                    <p className="text-gray-400">{user.email}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-green-900/30 text-green-400 text-xs border border-green-500/30">
                        {user.role === 'admin' ? 'Administrateur' : 'Développeur'}
                    </span>
                </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-white hover:bg-red-600 px-4 py-2 rounded-lg transition-all border border-red-500/30">
                <LogOut size={16}/> Déconnexion
            </button>
        </div>
        
        {/* STATS GRID */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-[#18181b] border border-[#27272a] p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Box size={64}/></div>
                <h3 className="text-gray-400 text-sm mb-1">Mes Paquets</h3>
                <p className="text-4xl font-black text-white">{stats.count}</p>
            </div>
            <div className="bg-[#18181b] border border-[#27272a] p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Download size={64}/></div>
                <h3 className="text-gray-400 text-sm mb-1">Téléchargements Totaux</h3>
                <p className="text-4xl font-black text-blue-400">{stats.downloads}</p>
            </div>
            <div className="bg-[#18181b] border border-[#27272a] p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={64}/></div>
                <h3 className="text-gray-400 text-sm mb-1">Status du Compte</h3>
                <p className="text-2xl font-bold text-green-400 mt-2">Actif</p>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* COLONNE GAUCHE : MES PAQUETS */}
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Box className="text-blue-500"/> Mes Publications</h2>
                    {/* Note: Le bouton publier renvoie vers la doc car on publie via CLI */}
                    <Link to="/docs" className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                        <Plus size={14}/> Publier un paquet
                    </Link>
                </div>

                <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                    {loadingPkgs ? (
                        <div className="p-8 text-center text-gray-500">Chargement de vos données...</div>
                    ) : myPackages.length > 0 ? (
                        <div className="divide-y divide-gray-800">
                            {myPackages.map(p => (
                                <div key={p.name} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <div>
                                        <Link to={`/packages/${p.name}`} className="font-bold text-white hover:text-blue-400 hover:underline">{p.name}</Link>
                                        <p className="text-xs text-gray-500">v{p.version} • Mis à jour le {new Date(p.updated_at || Date.now()).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1"><Download size={14}/> {p.downloads_count}</span>
                                        <span className="px-2 py-0.5 bg-gray-800 rounded text-xs">{p.license}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 text-center">
                            <Box size={48} className="mx-auto text-gray-700 mb-4"/>
                            <p className="text-gray-400 mb-2">Vous n'avez pas encore publié de paquet.</p>
                            <Link to="/docs" className="text-blue-400 hover:underline text-sm">Comment publier mon premier paquet ?</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* COLONNE DROITE : API TOKEN */}
            <div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Key className="text-yellow-500"/> Clé API</h2>
                <div className="bg-[#18181b] border border-[#27272a] p-6 rounded-xl">
                    <p className="text-gray-400 text-sm mb-6">
                        Cette clé est nécessaire pour publier des paquets via le CLI Zenv.
                        <br/><code className="text-blue-400 bg-blue-900/20 px-1">zenv auth &lt;token&gt;</code>
                    </p>
                    
                    {!token ? (
                        <button onClick={genToken} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-blue-900/20">
                            Générer une clé
                        </button>
                    ) : (
                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                            <p className="text-xs text-green-400 mb-2 font-bold uppercase tracking-wider">Nouvelle clé générée</p>
                            <div className="flex gap-2 items-center">
                                <code className="flex-1 bg-black/50 p-2 rounded text-xs break-all font-mono text-white select-all">{token}</code>
                                <button onClick={copyToken} className="p-2 bg-white/10 hover:bg-white/20 rounded text-white" title="Copier">
                                    <Key size={16} />
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Copiez-la maintenant. Elle ne sera plus affichée.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
export default Dashboard;