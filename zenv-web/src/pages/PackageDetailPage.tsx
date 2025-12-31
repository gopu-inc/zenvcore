import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Package, Download, User, Calendar, Code, FileText } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { packageService } from "@/services/api"

const PackageDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>()
  const [pkg, setPackage] = useState<any>(null)
  const [readme, setReadme] = useState("")
  const [activeTab, setActiveTab] = useState("readme")
  
  useEffect(() => {
    if (name) {
      loadPackage()
      loadReadme()
    }
  }, [name])
  
  const loadPackage = async () => {
    try {
      const data = await packageService.getPackage(name!)
      setPackage(data)
    } catch (error) {
      console.error(error)
    }
  }
  
  const loadReadme = async () => {
    try {
      const data = await packageService.getReadme(name!)
      setReadme(data)
    } catch (error) {
      setReadme("# README non disponible")
    }
  }
  
  if (!pkg) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Chargement...</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="rounded-xl bg-zenv-100 p-4">
              <Package className="h-8 w-8 text-zenv-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{pkg.name}</h1>
              <p className="text-lg text-muted-foreground">{pkg.description}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User size={14} />
              {pkg.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(pkg.updated_at).toLocaleDateString()}
            </span>
            <span className="px-2 py-1 bg-muted rounded">
              v{pkg.version}
            </span>
            <span className="px-2 py-1 bg-muted rounded">
              {pkg.license}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <button className="btn btn-primary btn-lg">
            <Download className="mr-2" />
            Télécharger v{pkg.version}
          </button>
          <code className="text-sm p-3 bg-muted rounded">
            pip install {pkg.name}
          </code>
        </div>
      </div>
      
      <div className="border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("readme")}
            className={\`pb-3 border-b-2 \${activeTab === "readme" ? "border-primary" : "border-transparent"}\`}
          >
            <FileText className="inline mr-2" size={16} />
            README
          </button>
          <button
            onClick={() => setActiveTab("files")}
            className={\`pb-3 border-b-2 \${activeTab === "files" ? "border-primary" : "border-transparent"}\`}
          >
            <Code className="inline mr-2" size={16} />
            Fichiers
          </button>
        </div>
      </div>
      
      <div className="prose max-w-none">
        {activeTab === "readme" && (
          <ReactMarkdown>{readme}</ReactMarkdown>
        )}
        
        {activeTab === "files" && (
          <div className="space-y-2">
            {pkg.files?.map((file: string, i: number) => (
              <div key={i} className="p-3 border rounded hover:bg-muted">
                {file}
              </div>
            )) || (
              <p className="text-muted-foreground">Aucun fichier disponible</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PackageDetailPage
