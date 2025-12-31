import os
import json
from pathlib import Path

class FrontendGenerator:
    def __init__(self):
        self.project_name = "zenv-hub-frontend"
        self.server_url = "https://zenv-hub.onrender.com"
    
    def generate(self):
        self.create_structure()
        self.create_package_json()
        self.create_vite_config()
        self.create_tsconfig()
        self.create_tailwind_config()
        self.create_global_css()
        self.create_index_html()
        self.create_main_tsx()
        self.create_app_tsx()
        self.create_api_service()
        self.create_store()
        self.create_components()
        self.create_pages()
        self.create_env()
        self.create_docker()
        
        print(f"Frontend généré dans: {self.project_name}")
        print("Commandes:")
        print(f"cd {self.project_name}")
        print("npm install")
        print("npm run dev")
    
    def create_structure(self):
        dirs = [
            "src/components/common",
            "src/components/layout", 
            "src/components/packages",
            "src/components/badges",
            "src/pages",
            "src/hooks",
            "src/services",
            "src/utils",
            "src/styles",
            "src/assets",
            "public"
        ]
        
        for d in dirs:
            Path(self.project_name) / d
            (Path(self.project_name) / d).mkdir(parents=True, exist_ok=True)
    
    def create_package_json(self):
        package = {
            "name": "zenv-hub-frontend",
            "private": True,
            "version": "1.0.0",
            "type": "module",
            "scripts": {
                "dev": "vite",
                "build": "tsc && vite build",
                "preview": "vite preview",
                "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
            },
            "dependencies": {
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "react-router-dom": "^6.14.0",
                "axios": "^1.5.0",
                "zustand": "^4.4.1",
                "react-markdown": "^9.0.0",
                "remark-gfm": "^14.0.0",
                "react-icons": "^4.11.0",
                "lucide-react": "^0.291.0",
                "react-hot-toast": "^2.4.1",
                "date-fns": "^2.30.0",
                "clsx": "^2.0.0",
                "tailwind-merge": "^2.0.0",
                "@radix-ui/react-dialog": "^1.0.5",
                "@radix-ui/react-tabs": "^1.0.4",
                "framer-motion": "^10.16.4"
            },
            "devDependencies": {
                "@types/react": "^18.2.15",
                "@types/react-dom": "^18.2.7",
                "@typescript-eslint/eslint-plugin": "^6.0.0",
                "@typescript-eslint/parser": "^6.0.0",
                "@vitejs/plugin-react": "^4.0.3",
                "autoprefixer": "^10.4.15",
                "eslint": "^8.45.0",
                "eslint-plugin-react-hooks": "^4.6.0",
                "eslint-plugin-react-refresh": "^0.4.3",
                "postcss": "^8.4.29",
                "tailwindcss": "^3.3.3",
                "typescript": "^5.0.2",
                "vite": "^4.4.9"
            }
        }
        
        with open(Path(self.project_name) / 'package.json', 'w') as f:
            json.dump(package, f, indent=2)
    
    def create_vite_config(self):
        config = '''import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://zenv-hub.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
'''
        with open(Path(self.project_name) / 'vite.config.ts', 'w') as f:
            f.write(config)
    
    def create_tsconfig(self):
        config = {
            "compilerOptions": {
                "target": "ES2020",
                "useDefineForClassFields": True,
                "lib": ["ES2020", "DOM", "DOM.Iterable"],
                "module": "ESNext",
                "skipLibCheck": True,
                "moduleResolution": "bundler",
                "allowImportingTsExtensions": True,
                "resolveJsonModule": True,
                "isolatedModules": True,
                "noEmit": True,
                "jsx": "react-jsx",
                "strict": True,
                "noUnusedLocals": True,
                "noUnusedParameters": True,
                "noFallthroughCasesInSwitch": True,
                "baseUrl": ".",
                "paths": {
                    "@/*": ["src/*"]
                }
            },
            "include": ["src"],
            "references": [{"path": "./tsconfig.node.json"}]
        }
        
        with open(Path(self.project_name) / 'tsconfig.json', 'w') as f:
            json.dump(config, f, indent=2)
        
        node_config = {
            "compilerOptions": {
                "composite": True,
                "skipLibCheck": True,
                "module": "ESNext",
                "moduleResolution": "bundler",
                "allowSyntheticDefaultImports": True
            },
            "include": ["vite.config.ts"]
        }
        
        with open(Path(self.project_name) / 'tsconfig.node.json', 'w') as f:
            json.dump(node_config, f, indent=2)
    
    def create_tailwind_config(self):
        config = '''export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        zenv: {
          50: '#e6f7ff',
          100: '#bae7ff',
          500: '#1890ff',
          600: '#096dd9',
          700: '#0050b3',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
'''
        with open(Path(self.project_name) / 'tailwind.config.js', 'w') as f:
            f.write(config)
    
    def create_global_css(self):
        css = '''@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
  .btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50;
  }
  .btn-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90;
  }
  .btn-secondary {
    @apply bg-secondary text-secondary-foreground hover:bg-secondary/80;
  }
  .btn-outline {
    @apply border border-input bg-background hover:bg-accent hover:text-accent-foreground;
  }
  .card {
    @apply rounded-lg border bg-card text-card-foreground shadow-sm;
  }
  .input {
    @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
  }
}
'''
        with open(Path(self.project_name) / 'src' / 'styles' / 'globals.css', 'w') as f:
            f.write(css)
    
    def create_index_html(self):
        html = '''<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Zenv Package Hub" />
    <title>Zenv Package Hub</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
'''
        with open(Path(self.project_name) / 'index.html', 'w') as f:
            f.write(html)
    
    def create_main_tsx(self):
        main = '''import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import App from "./App"
import "./styles/globals.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" />
    </BrowserRouter>
  </React.StrictMode>
)
'''
        with open(Path(self.project_name) / 'src' / 'main.tsx', 'w') as f:
            f.write(main)
    
    def create_app_tsx(self):
        app = '''import React from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "./components/layout/Layout"
import HomePage from "./pages/HomePage"
import PackagesPage from "./pages/PackagesPage"
import PackageDetailPage from "./pages/PackageDetailPage"
import BadgesPage from "./pages/BadgesPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="packages" element={<PackagesPage />} />
        <Route path="packages/:name" element={<PackageDetailPage />} />
        <Route path="badges" element={<BadgesPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
    </Routes>
  )
}

export default App
'''
        with open(Path(self.project_name) / 'src' / 'App.tsx', 'w') as f:
            f.write(app)
    
    def create_api_service(self):
        api = '''import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "https://zenv-hub.onrender.com"

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("zenv_token")
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`
  }
  return config
})

export const packageService = {
  listPackages: () => api.get("/api/packages").then(res => res.data),
  getPackage: (name: string) => api.get(\`/api/packages/\${name}\`).then(res => res.data),
  downloadPackage: (name: string, version: string) => 
    api.get(\`/api/packages/download/\${name}/\${version}\`, { responseType: "blob" }),
  uploadPackage: (formData: FormData) => 
    api.post("/api/packages/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }),
  getReadme: (name: string) => api.get(\`/api/readme/\${name}\`).then(res => res.data),
  getLicense: (name: string) => api.get(\`/api/license/\${name}\`).then(res => res.data),
}

export const badgeService = {
  listBadges: () => api.get("/api/badges").then(res => res.data),
  createBadge: (data: any) => api.post("/api/badges", data),
  getBadgeSvg: (name: string, options?: any) => 
    api.get(\`/badge/svg/\${name}\`, { params: options, responseType: "text" }),
}

export const authService = {
  login: (username: string, password: string) => 
    api.post("/api/auth/login", { username, password }),
  register: (username: string, email: string, password: string) => 
    api.post("/api/auth/register", { username, email, password }),
  getProfile: () => api.get("/api/auth/profile"),
}

export default api
'''
        with open(Path(self.project_name) / 'src' / 'services' / 'api.ts', 'w') as f:
            f.write(api)
    
    def create_store(self):
        store = '''import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  username: string
  email: string
  role: string
}

interface AppState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  theme: "light" | "dark"
  
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setTheme: (theme: "light" | "dark") => void
  logout: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      theme: "light",
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        set({ token })
        if (token) {
          localStorage.setItem("zenv_token", token)
        }
      },
      setTheme: (theme) => {
        set({ theme })
        if (theme === "dark") {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        localStorage.removeItem("zenv_token")
        localStorage.removeItem("zenv_user")
      },
    }),
    { name: "zenv-store" }
  )
)
'''
        with open(Path(self.project_name) / 'src' / 'hooks' / 'useStore.ts', 'w') as f:
            f.write(store)
    
    def create_components(self):
        layout = '''import React from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
'''
        
        header = '''import React, { useState } from "react"
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
'''
        
        footer = '''import React from "react"
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
'''
        
        package_card = '''import React from "react"
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
'''
        
        badge_generator = '''import React, { useState } from "react"
import { Copy, Palette } from "lucide-react"

const BadgeGenerator: React.FC = () => {
  const [label, setLabel] = useState("version")
  const [value, setValue] = useState("1.0.0")
  const [color, setColor] = useState("blue")
  
  const badgeUrl = \`/badge/custom/\${label}/\${value}/\${color}\`
  
  const colors = [
    { value: "blue", name: "Bleu" },
    { value: "green", name: "Vert" },
    { value: "red", name: "Rouge" },
    { value: "orange", name: "Orange" },
    { value: "yellow", name: "Jaune" },
  ]
  
  const handleCopy = () => {
    navigator.clipboard.writeText(badgeUrl)
  }
  
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-6">Générateur de Badge</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="input w-full"
              placeholder="version"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Valeur</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input w-full"
              placeholder="1.0.0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Palette size={16} />
              Couleur
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={\`px-3 py-2 rounded \${color === c.value ? 'bg-primary text-white' : 'bg-muted'}\`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-6 flex items-center justify-center">
            <img src={badgeUrl} alt="Badge preview" className="h-8" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">URL du badge</label>
            <div className="flex gap-2">
              <code className="flex-1 text-sm p-2 bg-muted rounded truncate">
                {badgeUrl}
              </code>
              <button onClick={handleCopy} className="btn btn-outline">
                <Copy size={16} />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Markdown</label>
            <code className="block text-sm p-2 bg-muted rounded">
              ![{label}: {value}]({badgeUrl})
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BadgeGenerator
'''
        
        with open(Path(self.project_name) / 'src' / 'components' / 'layout' / 'Layout.tsx', 'w') as f:
            f.write(layout)
        with open(Path(self.project_name) / 'src' / 'components' / 'layout' / 'Header.tsx', 'w') as f:
            f.write(header)
        with open(Path(self.project_name) / 'src' / 'components' / 'layout' / 'Footer.tsx', 'w') as f:
            f.write(footer)
        with open(Path(self.project_name) / 'src' / 'components' / 'packages' / 'PackageCard.tsx', 'w') as f:
            f.write(package_card)
        with open(Path(self.project_name) / 'src' / 'components' / 'badges' / 'BadgeGenerator.tsx', 'w') as f:
            f.write(badge_generator)
    
    def create_pages(self):
        home = '''import React, { useEffect, useState } from "react"
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
'''
        
        packages = '''import React, { useEffect, useState } from "react"
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
'''
        
        package_detail = '''import React, { useEffect, useState } from "react"
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
'''
        
        badges = '''import React, { useEffect, useState } from "react"
import { Zap, Copy } from "lucide-react"
import BadgeGenerator from "@/components/badges/BadgeGenerator"
import { badgeService } from "@/services/api"

const BadgesPage: React.FC = () => {
  const [badges, setBadges] = useState<any[]>([])
  
  useEffect(() => {
    loadBadges()
  }, [])
  
  const loadBadges = async () => {
    try {
      const data = await badgeService.listBadges()
      setBadges(data.badges.slice(0, 10))
    } catch (error) {
      console.error(error)
    }
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Badges</h1>
        <p className="text-muted-foreground">
          Créez et gérez des badges SVG pour vos projets
        </p>
      </div>
      
      <BadgeGenerator />
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Badges Récemment</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-zenv-500" />
                  <span className="font-semibold">{badge.name}</span>
                </div>
                <button className="btn btn-outline btn-sm">
                  <Copy size={14} />
                </button>
              </div>
              
              <div className="flex justify-center mb-4">
                <img
                  src={\`/badge/svg/\${badge.name}\`}
                  alt={badge.name}
                  className="h-8"
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                {badge.label}: {badge.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BadgesPage
'''
        
        login = '''import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { LogIn, Mail, Lock } from "lucide-react"
import { useStore } from "@/hooks/useStore"
import { authService } from "@/services/api"
import { toast } from "react-hot-toast"

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser, setToken } = useStore()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    
    try {
      setLoading(true)
      const response = await authService.login(username, password)
      
      setUser(response.user)
      setToken(response.token.access_token)
      localStorage.setItem("zenv_user", JSON.stringify(response.user))
      
      toast.success("Connexion réussie!")
      navigate("/")
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-xl bg-zenv-100 mb-4">
          <LogIn className="h-8 w-8 text-zenv-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Connexion</h1>
        <p className="text-muted-foreground">
          Connectez-vous à votre compte Zenv Hub
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <Mail className="inline mr-2" size={14} />
            Email ou nom d'utilisateur
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input w-full"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            <Lock className="inline mr-2" size={14} />
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full"
            placeholder="••••••••"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        
        <div className="text-center text-sm text-muted-foreground">
          Pas encore de compte?{" "}
          <Link to="/register" className="text-primary hover:underline">
            S'inscrire
          </Link>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
'''
        
        register = '''import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { User, Mail, Lock } from "lucide-react"
import { useStore } from "@/hooks/useStore"
import { authService } from "@/services/api"
import { toast } from "react-hot-toast"

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser, setToken } = useStore()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !email || !password) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }
    
    if (password.length < 8) {
      toast.error("Le mot de passe doit faire au moins 8 caractères")
      return
    }
    
    try {
      setLoading(true)
      const response = await authService.register(username, email, password)
      
      setUser(response.user)
      setToken(response.token.access_token)
      localStorage.setItem("zenv_user", JSON.stringify(response.user))
      
      toast.success("Inscription réussie!")
      navigate("/")
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur d'inscription")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-xl bg-zenv-100 mb-4">
          <User className="h-8 w-8 text-zenv-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Inscription</h1>
        <p className="text-muted-foreground">
          Créez votre compte Zenv Hub
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <User className="inline mr-2" size={14} />
            Nom d'utilisateur
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input w-full"
            placeholder="john_doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            <Mail className="inline mr-2" size={14} />
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            <Lock className="inline mr-2" size={14} />
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full"
            placeholder="••••••••"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input w-full"
            placeholder="••••••••"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </button>
        
        <div className="text-center text-sm text-muted-foreground">
          Déjà un compte?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </div>
      </form>
    </div>
  )
}

export default RegisterPage
'''
        
        with open(Path(self.project_name) / 'src' / 'pages' / 'HomePage.tsx', 'w') as f:
            f.write(home)
        with open(Path(self.project_name) / 'src' / 'pages' / 'PackagesPage.tsx', 'w') as f:
            f.write(packages)
        with open(Path(self.project_name) / 'src' / 'pages' / 'PackageDetailPage.tsx', 'w') as f:
            f.write(package_detail)
        with open(Path(self.project_name) / 'src' / 'pages' / 'BadgesPage.tsx', 'w') as f:
            f.write(badges)
        with open(Path(self.project_name) / 'src' / 'pages' / 'LoginPage.tsx', 'w') as f:
            f.write(login)
        with open(Path(self.project_name) / 'src' / 'pages' / 'RegisterPage.tsx', 'w') as f:
            f.write(register)
    
    def create_env(self):
        env = '''VITE_API_URL=https://zenv-hub.onrender.com
VITE_APP_NAME=Zenv Package Hub
'''
        with open(Path(self.project_name) / '.env', 'w') as f:
            f.write(env)
    
    def create_docker(self):
        dockerfile = '''FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
'''
        
        nginx = '''events {
    worker_connections 1024;
}
http {
    server {
        listen 80;
        root /usr/share/nginx/html;
        index index.html;
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
'''
        
        with open(Path(self.project_name) / 'Dockerfile', 'w') as f:
            f.write(dockerfile)
        with open(Path(self.project_name) / 'nginx.conf', 'w') as f:
            f.write(nginx)

if __name__ == "__main__":
    generator = FrontendGenerator()
    generator.generate()