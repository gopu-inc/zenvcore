import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PackageService, BadgeService } from '../services/api';
import Loader from '../components/Loader';
import ReactMarkdown from 'react-markdown';
import { Download, Box, FileText, Terminal, Copy } from 'lucide-react';
import { toast } from 'react-toastify';

const PackageDetail = () => {
  const { name } = useParams();
  const [pkg, setPkg] = useState(null);
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
        try {
            // 1. Récupérer les infos du package
            // L'API peut retourner un tableau (search) ou un objet
            let pkgData = null;
            try {
                const res = await PackageService.getOne(name);
                if (res.data.packages && res.data.packages.length > 0) {
                    pkgData = res.data.packages.find(p => p.name === name) || res.data.packages[0];
                } else if (res.data && res.data.name) {
                    pkgData = res.data;
                }
            } catch (err) {
                // Fallback search si getOne échoue
                const searchRes = await PackageService.search(name);
                if (searchRes.data.packages) {
                     pkgData = searchRes.data.packages.find(p => p.name === name);
                }
            }

            if (!pkgData) throw new Error("Package not found");
            setPkg(pkgData);

            // 2. Récupérer le README (Texte seulement pour éviter CORS binaire)
            try {
                const rmRes = await PackageService.getReadme(name);
                setReadme(rmRes.data || "# No README provided");
            } catch (e) {
                setReadme("# Failed to load README");
            }

        } catch (err) {
            console.error(err);
            setError('Package introuvable ou erreur serveur.');
        } finally {
            setLoading(false);
        }
    };
    load();
  }, [name]);

  const copyInstall = () => {
    navigator.clipboard.writeText(`znv install ${name}`);
    toast.success('Commande copiée !');
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center p-20 text-red-500 bg-black">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2 text-white">
                    <Box className="text-blue-500"/> {pkg.name}
                </h1>
                <p className="text-gray-400 text-lg">{pkg.description}</p>
                <div className="flex gap-3 mt-4 text-sm font-mono text-gray-500">
                    <span className="bg-blue-900/20 text-blue-400 px-2 py-1 rounded">v{pkg.version}</span>
                    <span>{pkg.license || 'MIT'}</span>
                    <span>{pkg.author || 'Unknown'}</span>
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <div className="bg-black p-3 rounded border border-gray-800 flex items-center gap-3 font-mono text-sm text-green-400 cursor-pointer hover:bg-gray-900" onClick={copyInstall}>
                    <Terminal size={14} />
                    znv install {pkg.name}
                    <Copy size={14} className="ml-2 text-gray-500"/>
                </div>
                <a 
                    href={PackageService.downloadUrl(pkg.name, pkg.version)} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-bold text-center flex items-center justify-center gap-2"
                >
                    <Download size={16}/> Download .zv
                </a>
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2 flex items-center gap-2 text-white">
                    <FileText size={20}/> README
                </h2>
                <div className="prose prose-invert max-w-none text-gray-300">
                    <ReactMarkdown>{readme}</ReactMarkdown>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                <h3 className="font-bold mb-4 text-white">Badge</h3>
                <div className="bg-black p-4 rounded border border-gray-800 flex justify-center">
                    <img src={BadgeService.getSvg(pkg.name)} alt="badge" />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">Add to your README</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;