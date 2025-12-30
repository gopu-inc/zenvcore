import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PackageService, BadgeService } from '../services/api';
import Loader from '../components/Loader';
import ReactMarkdown from 'react-markdown';
import { Download, Box, FileText, Terminal, Copy, AlertCircle } from 'lucide-react';
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
            // 1. On cherche le paquet dans la liste globale
            const packageData = await PackageService.getOne(name);
            setPkg(packageData);

            // 2. On charge le README
            try {
                const rmRes = await PackageService.getReadme(name);
                setReadme(rmRes.data || "Aucun README disponible.");
            } catch {
                setReadme("# README non disponible");
            }

        } catch (err) {
            console.error(err);
            setError("Impossible de trouver ce paquet. Il n'existe peut-être pas ou le serveur redémarre.");
        } finally {
            setLoading(false);
        }
    };
    load();
  }, [name]);

  const copyInstall = () => {
    navigator.clipboard.writeText(`zenv install ${name}`);
    toast.success('Copié !');
  };

  if (loading) return <Loader />;
  
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-400">
        <AlertCircle size={48} className="mb-4"/>
        <h2 className="text-xl font-bold">Erreur</h2>
        <p>{error}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2 text-white">
                    <Box className="text-blue-500"/> {pkg.name}
                </h1>
                <p className="text-gray-400 text-lg">{pkg.description || "Pas de description"}</p>
                <div className="flex gap-3 mt-4 text-sm font-mono text-gray-500">
                    <span className="bg-blue-900/20 text-blue-400 px-2 py-1 rounded">v{pkg.version}</span>
                    <span>{pkg.license || 'MIT'}</span>
                    <span>{pkg.author || 'Inconnu'}</span>
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <div onClick={copyInstall} className="bg-black p-3 rounded border border-gray-800 flex items-center gap-3 font-mono text-sm text-green-400 cursor-pointer hover:bg-gray-900 transition-colors">
                    <Terminal size={14} />
                    znv install {pkg.name}
                    <Copy size={14} className="ml-2 text-gray-500"/>
                </div>
                <a 
                    href={PackageService.downloadUrl(pkg.name, pkg.version)}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-bold text-center flex items-center justify-center gap-2"
                >
                    <Download size={16}/> Download .zv
                </a>
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#18181b] border border-[#27272a] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2 flex items-center gap-2 text-white">
                <FileText size={20}/> README
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300">
                <ReactMarkdown>{readme}</ReactMarkdown>
            </div>
        </div>

        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 h-fit">
            <h3 className="font-bold mb-4 text-white">Badge Officiel</h3>
            <div className="bg-black p-4 rounded border border-gray-800 flex justify-center mb-2">
                <img src={BadgeService.getSvg(pkg.name)} alt="badge" />
            </div>
            <p className="text-center text-xs text-gray-500">Ajoutez ceci à votre git</p>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;