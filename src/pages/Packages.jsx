import React, { useEffect, useState } from 'react';
import { PackageService } from '../services/api';
import { Link } from 'react-router-dom';
import { Search, Download, Box } from 'lucide-react';
import Loader from '../components/Loader';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await PackageService.getAll();
      if(res.data && res.data.packages) {
        setPackages(res.data.packages);
      }
    } catch (error) {
      console.error("Error fetching packages", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        if (!searchTerm) {
            fetchPackages();
            return;
        }
        const res = await PackageService.search(searchTerm);
        if(res.data && res.data.packages) {
            setPackages(res.data.packages);
        } else {
            setPackages([]);
        }
    } catch(err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">Explore Packages</h1>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <input 
                type="text" 
                placeholder="Search packages..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.length > 0 ? packages.map((pkg) => (
            <Link key={pkg.name} to={`/packages/${pkg.name}`} className="block group">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 h-full hover:border-blue-500/50 hover:bg-slate-800 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-900/20 rounded-lg text-blue-400">
                            <Box size={24} />
                        </div>
                        <span className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-400 font-mono">v{pkg.version}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{pkg.name}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4">{pkg.description || 'No description provided.'}</p>
                    
                    <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-700/50 pt-4 mt-auto">
                        <span>by {pkg.author}</span>
                        <span className="flex items-center gap-1"><Download size={12} /> {pkg.downloads_count || 0}</span>
                    </div>
                </div>
            </Link>
          )) : (
            <div className="col-span-full text-center py-20 text-slate-500">
                No packages found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Packages;