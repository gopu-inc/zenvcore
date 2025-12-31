import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Package, Zap, Menu, X, User, LogOut, Moon, Sun, Search } from "lucide-react"
import { useStore } from "@/hooks/useStore"

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, theme, setTheme, logout } = useStore()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    navigate("/login")
  }
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link to="/" className="flex items-center gap-2">
              <div className="rounded-lg bg-zenv-500 p-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Zenv Hub</span>
            </Link>
          </div>
          
          <div className="hidden lg:block flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Rechercher packages..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2">
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-zenv-100 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="hidden md:inline">{user?.username}</span>
                </Link>
                <button onClick={handleLogout} className="p-2">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-outline">Connexion</Link>
                <Link to="/register" className="btn btn-primary">Inscription</Link>
              </div>
            )}
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="lg:hidden border-t py-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
                />
              </div>
            </div>
            
            <nav className="space-y-2">
              <Link to="/packages" className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                <Package size={18} />
                Packages
              </Link>
              <Link to="/badges" className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                <Zap size={18} />
                Badges
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
