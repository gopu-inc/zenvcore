import React, { useEffect, useState } from 'react';
import { PackageService } from '../services/api';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { Search, Package } from 'lucide-react';

const Packages = () => {
  const [pkgs, setPkgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const fetchPkgs = async (q = '') => {
    setLoading(true);
    try {
        const res = q ? await PackageService.search(q) : await PackageService.getAll();
        setPkgs(res.data.packages || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchPkgs(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPkgs(query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold">Packages</h1>
            <form onSubmit={handleSearch} className="relative w-full md:w-96">
                <input 
                    className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Search packages..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            </form>
        </div>

        {loading ? <Loader /> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pkgs.map(p => (
                    <Link key={p.name} to={`/packages/${p.name}`} className="bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-all">
                        <div className="flex justify-between mb-4">
                            <div className="p-2 bg-primary/10 text-primary rounded"><Package /></div>
                            <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">{p.version}</span>
                        </div>
                        <h2 className="font-bold text-lg mb-1">{p.name}</h2>
                        <p className="text-sm text-gray-400 line-clamp-2">{p.description}</p>
                    </Link>
                ))}
            </div>
        )}
    </div>
  );
};
export default Packages;