import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PackageService, BadgeService } from '../services/api';
import Loader from '../components/Loader';
import { Download, Copy, Shield, Calendar, User } from 'lucide-react';
import { toast } from 'react-toastify';

const PackageDetail = () => {
  const { name } = useParams();
  const [pkg, setPkg] = useState(null);
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await PackageService.getOne(name);
            if (res.data && res.data.packages) {
                 // L'API search retourne une liste, l'API detail peut varier, 
                 // ici on suppose une logique pour trouver le bon package si l'endpoint change
                 const found = res.data.packages.find(p => p.name === name) || res.data.packages[0]; 
                 setPkg(found);
            } else if (res.data) {
                 // Si l'endpoint retourne direct l'objet
                 setPkg(res.data);
            }

            const readmeRes = await PackageService.getReadme(name);
            setReadme(readmeRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [name]);

  const copyInstall = () => {
    navigator.clipboard.writeText(`zenv install ${name}`);
    toast.success('Install command copied!');
  };

  if (loading) return <Loader />;
  if (!pkg) return <div className="text-center py-20 text-white">Package not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{pkg.name}</h1>
                    <p className="text-xl text-slate-400 mb-4">{pkg.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                        <span className="flex items-center gap-1"><User size={16} className="text-blue-400"/> {pkg.author}</span>
                        <span className="flex items-center gap-1"><Shield size={16} className="text-green-400"/> {pkg.license || 'MIT'}</span>
                        <span className="flex items-center gap-1"><Calendar size={16} className="text-purple-400"/> v{pkg.version}</span>
                    </div>
                </div>
                
                <div className="w-full md:w-auto flex flex-col gap-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-1 flex items-center">
                        <code className="px-3 text-blue-300 font-mono text-sm">$ zenv install {pkg.name}</code>
                        <button onClick={copyInstall} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                            <Copy size={16} />
                        </button>
                    </div>
                    <a 
                        href={`https://zenv-hub.onrender.com/api/packages/download/${name}/${pkg.version}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <Download size={18} /> Download .zv
                    </a>
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* Readme Content */}
            <div className="lg:col-span-2">
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-2">README</h2>
                    <div 
                        className="prose prose-invert max-w-none prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800"
                        dangerouslySetInnerHTML={{ __html: readme || '<p>No README available.</p>' }}
                    />
                </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
                <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
                    <h3 className="font-bold text-white mb-4">Metadata</h3>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li className="flex justify-between">
                            <span>Version</span>
                            <span className="text-white">{pkg.version}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>License</span>
                            <span className="text-white">{pkg.license || 'MIT'}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Size</span>
                            <span className="text-white">{pkg.size ? (pkg.size / 1024).toFixed(1) + ' KB' : 'Unknown'}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Downloads</span>
                            <span className="text-white">{pkg.downloads_count || 0}</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
                    <h3 className="font-bold text-white mb-4">Badges</h3>
                    <p className="text-sm text-slate-400 mb-4">Use this badge in your repository.</p>
                    <img src={BadgeService.getSvgUrl(pkg.name) || `https://zenv-hub.onrender.com/badge/custom/${pkg.name}/${pkg.version}`} alt="badge" className="mb-2" />
                </div>
            </div>
        </div>
    </div>
  );
};

export default PackageDetail;