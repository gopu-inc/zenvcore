import React from "react"
import { Github, Package, Zap } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="border-t mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-zenv-500 p-1">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">Zenv Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Gestionnaire de packages et badges pour Zenv
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Liens</h3>
            <ul className="space-y-2">
              <li><a href="/packages" className="text-sm hover:text-primary">Packages</a></li>
              <li><a href="/badges" className="text-sm hover:text-primary">Badges</a></li>
              <li><a href="https://github.com/gopu-inc/zenvcore" className="text-sm hover:text-primary flex items-center gap-1">
                <Github size={14} />
                GitHub
              </a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">API</h3>
            <ul className="space-y-2">
              <li><a href="https://zenv-hub.onrender.com/api" className="text-sm hover:text-primary">Documentation API</a></li>
              <li><a href="https://pypi.org/project/zenv-lang" className="text-sm hover:text-primary">CLI PyPI</a></li>
              <li><a href="https://zenv-hub.onrender.com/api/version" className="text-sm hover:text-primary">Version</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Zenv Package Hub. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
