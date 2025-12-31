import { fetchPackages } from '@/lib/utils';
import Link from 'next/link';
import { Download, Search } from 'lucide-react';

export default async function PackagesPage() {
  const data = await fetchPackages();
  const packages = data.packages || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Explorer les Paquets</h1>
      
      <div className="relative mb-10">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Rechercher un paquet..." 
          className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      <div className="grid gap-4">
        {packages.map((pkg: any) => (
          <Link key={pkg.name} href={`/packages/${pkg.name}`} className="flex flex-col md:flex-row md:items-center justify-between bg-white/5 border border-white/10 p-6 rounded-lg hover:border-primary/50 transition">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-primary">{pkg.name}</h3>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">v{pkg.version}</span>
              </div>
              <p className="text-gray-400 mt-2">{pkg.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span>Par {pkg.author}</span>
                <span>•</span>
                <span>Licence {pkg.license}</span>
                <span>•</span>
                <span className="text-gray-400">Mis à jour {new Date(pkg.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2 text-gray-400">
              <Download className="w-4 h-4" />
              <span>{pkg.downloads_count}</span>
            </div>
          </Link>
        ))}
        {packages.length === 0 && (
            <div className="text-center py-20 text-gray-500">
                Aucun paquet trouvé. Publiez le premier !
            </div>
        )}
      </div>
    </div>
  );
}