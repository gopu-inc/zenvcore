import React, { useEffect, useState } from "react"
import { Search, Filter, Download } from "lucide-react"
import PackageCard from "@/components/packages/PackageCard"
import { packageService } from "@/services/api"

const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadPackages()
  }, [])
  
  const loadPackages = async () => {
    try {
      setLoading(true)
      const data = await packageService.listPackages()
      setPackages(data.packages)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(search.toLowerCase()) ||
    pkg.description.toLowerCase().includes(search.toLowerCase())
  )
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Packages</h1>
        <p className="text-muted-foreground">
          Découvrez et téléchargez des packages Zenv
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Rechercher des packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        <button className="btn btn-outline">
          <Filter className="mr-2" size={16} />
          Filtrer
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4">Chargement des packages...</p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun package trouvé</h3>
          <p className="text-muted-foreground">
            {search ? "Essayez avec d'autres termes" : "Aucun package disponible"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg, i) => (
            <PackageCard key={i} pkg={pkg} />
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center pt-8 border-t">
        <div className="text-sm text-muted-foreground">
          {filteredPackages.length} packages trouvés
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm">Précédent</button>
          <button className="btn btn-outline btn-sm">Suivant</button>
        </div>
      </div>
    </div>
  )
}

export default PackagesPage
