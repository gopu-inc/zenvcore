import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PackageService, BadgeService } from '../services/api';
import { extractPackageData } from '../utils/archive'; // Notre outil binaire
import Loader from '../components/Loader';
import ReactMarkdown from 'react-markdown';
import { Download, Box, FileText, Terminal } from 'lucide-react';

const PackageDetail = () => {
  const { name } = useParams();
  const [pkg, setPkg] = useState(null);
  const [readme, setReadme] = useState('');
  const [manifest, setManifest] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Infos API
        const res = await PackageService.getOne(name);
        const data = res.data.packages ? res.data.packages.find(p => p.name === name) : res.data;
        setPkg(data);

        if (data && data.version) {
            // 2. DÉCOMPRESSION RÉELLE DU .ZV
            const url = PackageService.downloadUrl(data.name, data.version);
            
            // On essaie de télécharger et extraire le binaire
            try {
                const extracted = await extractPackageData(url);
                if (extracted) {
                    setReadme(extracted.readme);
                    setManifest(extracted.manifest);
                    setFiles(extracted.files);
                } else {
                    // Fallback API si le binaire échoue (CORS ou autre)
                    const apiReadme = await PackageService.getReadme(name);
                    setReadme(apiReadme.data);
                }
            } catch (archiveErr) {
                console.warn("Binary extraction failed, falling back to API text", archiveErr);
                const apiReadme = await PackageService.getReadme(name);
                setReadme(apiReadme.data);
            }
        }
      } catch (err) {
        setError('Package not found or Hub offline.');
      }
      setLoading(false);
    };
    init();
  }, [name]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center p-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <Box className="text-blue-500"/> {pkg.name}
                </h1>
                <p className="text-gray-400 text-lg">{pkg.description}</p>
                <div className="flex gap-3 mt-4 text-sm font-mono text-gray-500">
                    <span className="bg-blue-900/20 text-blue-400 px-2 py-1 rounded">v{pkg.version}</span>
                    <span>{pkg.license}</span>
                    <span>{pkg.author}</span>
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <div className="bg-black p-3 rounded border border-gray-800 flex items-center gap-3 font-mono text-sm text-green-400">
                    <Terminal size={14} />
                    znv install {pkg.name}
                </div>
                <a href={PackageService.downloadUrl(pkg.name, pkg.version)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-bold text-center flex items-center justify-center gap-2">
                    <Download size={16}/> Download .zv
                </a>
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Colonne Gauche: README & Fichiers */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2 flex items-center gap-2">
                    <FileText size={20}/> README
                </h2>
                <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>{readme}</ReactMarkdown>
                </div>
            </div>

            {manifest && (
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Manifest (package.zcf)</h2>
                    <pre className="bg-black p-4 rounded text-sm text-gray-300 overflow-x-auto">
                        {manifest}
                    </pre>
                </div>
            )}
        </div>

        {/* Colonne Droite: Structure Fichiers */}
        <div className="space-y-6">
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                <h3 className="font-bold mb-4">Package Contents</h3>
                {files.length > 0 ? (
                    <ul className="text-sm font-mono space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                        {files.map((f, i) => (
                            <li key={i} className="flex justify-between text-gray-400">
                                <span>{f.path}</span>
                                <span className="text-gray-600">{f.size}b</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">Contents not loaded or package is empty.</p>
                )}
            </div>
            
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                <h3 className="font-bold mb-4">Badge</h3>
                <img src={BadgeService.getSvg(pkg.name)} alt="badge" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;