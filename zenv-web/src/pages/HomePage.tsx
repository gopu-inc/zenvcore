import React, { useEffect, useState } from "react"
import { Package, Zap, Shield, Globe, Download, Users } from "lucide-react"
import { Link } from "react-router-dom"
import PackageCard from "@/components/packages/PackageCard"
import { packageService } from "@/services/api"

const HomePage: React.FC = () => {
  const [packages, setPackages] = useState<any[]>([])
  
  useEffect(() => {
    loadPackages()
  }, [])
  
  const loadPackages = async () => {
    try {
      const data = await packageService.listPackages()
      setPackages(data.packages.slice(0, 6))
    } catch (error) {
      console.error(error)
    }
  }
  
  const features = [
    { icon: <Package />, title: "Packages", desc: "Gestion complète des packages Zenv" },
    { icon: <Zap />, title: "Badges", desc: "Générateur de badges SVG" },
    { icon: <Shield />, title: "Sécurité", desc: "Tokens d'accès sécurisés" },
    { icon: <Globe />, title: "Cloud", desc: "Dépôt GitHub privé" },
  ]
  
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Zenv Package Hub
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          La plateforme pour gérer et distribuer vos packages Zenv
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/packages" className="btn btn-primary btn-lg">
            <Package className="mr-2" />
            Explorer les Packages
          </Link>
          <Link to="/badges" className="btn btn-outline btn-lg">
            <Zap className="mr-2" />
            Créer un Badge
          </Link>
        </div>
      </section>
      
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Fonctionnalités</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div key={i} className="card p-6 text-center">
              <div className="inline-flex p-3 rounded-lg bg-zenv-100 mb-4">
                <div className="text-zenv-600">{feat.icon}</div>
              </div>
              <h3 className="font-bold mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Packages Récemment</h2>
          <Link to="/packages" className="btn btn-outline">
            Voir tous
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, i) => (
            <PackageCard key={i} pkg={pkg} />
          ))}
        </div>
      </section>
      
      <section className="bg-gradient-to-r from-zenv-500 to-purple-500 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Commencez dès maintenant</h2>
        <p className="mb-6 text-lg">
          Publiez votre premier package ou créez des badges personnalisés
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register" className="btn bg-white text-zenv-700 hover:bg-white/90">
            S'inscrire gratuitement
          </Link>
          <Link to="/packages" className="btn border-white text-white hover:bg-white/10">
            Explorer
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
