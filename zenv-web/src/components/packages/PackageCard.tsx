import React from "react"
import { Package, Download, User, Calendar } from "lucide-react"

interface PackageCardProps {
  pkg: {
    name: string
    version: string
    description: string
    author: string
    downloads_count: number
    updated_at: string
  }
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-zenv-100 p-2">
            <Package className="h-5 w-5 text-zenv-600" />
          </div>
          <div>
            <h3 className="font-bold">{pkg.name}</h3>
            <p className="text-sm text-muted-foreground">v{pkg.version}</p>
          </div>
        </div>
        <span className="text-xs px-2 py-1 bg-muted rounded">{pkg.downloads_count} dl</span>
      </div>
      
      <p className="text-sm mb-4 line-clamp-2">{pkg.description}</p>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <User size={12} />
            {pkg.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(pkg.updated_at).toLocaleDateString()}
          </span>
        </div>
        
        <button className="btn btn-outline btn-sm">
          <Download size={14} />
          Télécharger
        </button>
      </div>
    </div>
  )
}

export default PackageCard
