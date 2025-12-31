import { fetchPackageDetails } from '@/lib/utils';
import CopyButton from '@/components/CopyButton';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Download, Calendar, Shield, User, Terminal } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const runtime = 'edge'; // Optimisation pour Cloudflare

export default async function PackageDetail({ params }: { params: { name: string } }) {
  const pkg = await fetchPackageDetails(params.name);

  if (!pkg) {
    notFound();
  }

  const installCmd = `zenv install ${pkg.name}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Content */}
        <div className="lg:col-span-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{pkg.name}</h1>
            <p className="text-xl text-gray-400">{pkg.description}</p>
          </div>

          <div className="border-b border-white/10 mb-8 pb-4">
             <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">README / Description</h2>
          </div>

          <div className="bg-darker border border-white/5 rounded-xl p-8 min-h-[400px]">
            <MarkdownRenderer content={pkg.markdownContent} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Install Box */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Installation
            </h3>
            <div className="relative bg-black rounded-lg p-3 border border-white/10">
              <code className="text-green-400 text-sm font-mono">{installCmd}</code>
              <CopyButton text={installCmd} />
            </div>
            <p className="text-xs text-gray-500 mt-2">
                Nécessite <Link href="https://pypi.org/project/zenv-lang/" className="underline hover:text-primary">zenv-lang</Link> installé via pip.
            </p>
          </div>

          {/* Metadata */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg border-b border-white/10 pb-2">Métadonnées</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-2"><Download className="w-4 h-4"/> Téléchargements</span>
              <span className="font-mono">{pkg.downloads_count}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-2"><Box className="w-4 h-4"/> Version</span>
              <span>{pkg.version}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-2"><Shield className="w-4 h-4"/> Licence</span>
              <span>{pkg.license}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-2"><User className="w-4 h-4"/> Auteur</span>
              <span>{pkg.author}</span>
            </div>

             <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-2"><Calendar className="w-4 h-4"/> Mis à jour</span>
              <span className="text-sm">{new Date(pkg.updated_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Badges Preview */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Badge officiel</h3>
            <div className="flex justify-center bg-dark p-4 rounded-lg">
                <img 
                    src={`https://zenv-hub.onrender.com/badge/shields/${pkg.name}/${pkg.version}/blue`} 
                    alt="Badge"
                />
            </div>
            <p className="text-xs text-center mt-2 text-gray-500">Ajoutez ceci à votre README GitHub</p>
          </div>

        </div>
      </div>
    </div>
  );
}