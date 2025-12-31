import Link from 'next/link';
import { ArrowRight, Download, Box } from 'lucide-react';
import { fetchPackages } from '@/lib/utils';
import CopyButton from '@/components/CopyButton';

export default async function Home() {
  const data = await fetchPackages();
  const packages = data.packages || [];
  const latestPackages = packages.slice(0, 6);
  const CLI_CMD = "pip install zenv-lang";

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 flex flex-col items-center justify-center text-center bg-gradient-to-b from-blue-900/20 to-transparent">
        <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-primary/20">
          v2.0.0 is now available
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-400">
          Zenv Package Hub
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-10">
          Le gestionnaire de paquets moderne pour vos projets Python et Zenv. 
          Rapide, sécurisé et distribué via GitHub.
        </p>
        
        <div className="w-full max-w-xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-darker border border-white/10 rounded-lg p-4 flex items-center justify-between">
            <code className="text-green-400 font-mono text-lg ml-2">{CLI_CMD}</code>
            <CopyButton text={CLI_CMD} />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">Start by installing the CLI from PyPI</p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="max-w-7xl mx-auto w-full px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Box className="text-primary" />
            Derniers Paquets
          </h2>
          <Link href="/packages" className="text-sm text-primary hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPackages.map((pkg: any) => (
            <Link key={pkg.name} href={`/packages/${pkg.name}`} className="group relative bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition hover:border-primary/50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition">{pkg.name}</h3>
                <span className="bg-white/10 text-xs px-2 py-1 rounded text-gray-400">v{pkg.version}</span>
              </div>
              <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">{pkg.description || "Aucune description disponible"}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{pkg.author || "Unknown"}</span>
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {pkg.downloads_count || 0}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}