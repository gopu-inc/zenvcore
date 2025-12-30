import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PackageService, BadgeService } from '../services/api';
import Loader from '../components/Loader';
import { Download, Copy, Shield, User } from 'lucide-react';

const PackageDetail = () => {
  const { name } = useParams();
  const [pkg, setPkg] = useState(null);
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
        try {
            const res = await PackageService.getOne(name);
            setPkg(res.data.packages ? res.data.packages.find(p => p.name === name) : res.data);
            const rm = await PackageService.getReadme(name);
            setReadme(rm.data);
        } catch {}
        setLoading(false);
    };
    load();
  }, [name]);

  if (loading) return <Loader />;
  if (!pkg) return <div className="text-center p-20">Package not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-card border border-border rounded-xl p-8 mb-8">
            <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">{pkg.name}</h1>
                    <p className="text-xl text-gray-400 mb-4">{pkg.description}</p>
                    <div className="flex gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><User size={16}/> {pkg.author}</span>
                        <span className="flex items-center gap-1"><Shield size={16}/> {pkg.license || 'MIT'}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="bg-black/50 border border-border p-2 rounded flex items-center gap-2 font-mono text-sm">
                        <span className="text-primary">$</span> znv install {pkg.name}
                        <Copy size={14} className="cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText(`znv install ${pkg.name}`)} />
                    </div>
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-4 border-b border-border pb-2">README</h2>
                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: readme || 'No readme.' }} />
            </div>
            <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-bold mb-4">Stats</h3>
                    <div className="flex justify-between text-sm py-2 border-b border-border">
                        <span className="text-gray-400">Downloads</span>
                        <span>{pkg.downloads_count || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2">
                        <span className="text-gray-400">Version</span>
                        <span>{pkg.version}</span>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-bold mb-4">Badge</h3>
                    <img src={BadgeService.getSvg(pkg.name)} alt="Badge" />
                </div>
            </div>
        </div>
    </div>
  );
};
export default PackageDetail;