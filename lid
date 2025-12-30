import os
import sys

class UltimateGenerator:
    def __init__(self):
        self.root_dir = "zenv-ultimate"
        self.api_url = "https://zenv-hub.onrender.com"

    def create_dir(self, path):
        full_path = os.path.join(self.root_dir, path)
        if not os.path.exists(full_path):
            os.makedirs(full_path, exist_ok=True)

    def write_file(self, path, content):
        full_path = os.path.join(self.root_dir, path)
        try:
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content.strip())
            print(f"✅ Généré : {path}")
        except Exception as e:
            print(f"❌ Erreur critique sur {path}: {e}")
            sys.exit(1)

    def generate(self):
        print(f"☢️  INITIALISATION DU PROTOCOLE ZENV ULTIMATE...")
        print(f"📂 Dossier cible : {self.root_dir}")

        if not os.path.exists(self.root_dir):
            os.makedirs(self.root_dir)

        # Structure complète
        dirs = [
            "public",
            "src",
            "src/assets",
            "src/components",
            "src/contexts",
            "src/pages",
            "src/services",
            "src/utils",  # Pour le décompresseur
            "src/styles"
        ]
        for d in dirs:
            self.create_dir(d)

        # --- FICHIERS DE CONFIGURATION (CRITIQUE POUR ÉCRAN NOIR) ---
        
        self.write_package_json()
        self.write_vite_config()
        self.write_tailwind_config()
        self.write_postcss_config()
        self.write_redirects() # CLÉ POUR CLOUDFLARE
        self.write_index_html()
        self.write_gitignore()

        # --- CODE SOURCE ---
        
        self.write_main_jsx()
        self.write_app_jsx()
        self.write_index_css()
        
        # --- LOGIQUE BINAIRE (UNARCHIVER) ---
        self.write_archive_utils() 

        # --- SERVICES & CONTEXT ---
        self.write_api_service()
        self.write_auth_context()

        # --- COMPOSANTS AVANCÉS ---
        self.write_xterm_terminal() # VRAI TERMINAL XTERM
        self.write_navbar()
        self.write_footer()
        self.write_loader()
        self.write_protected_route()

        # --- PAGES ---
        self.write_home()
        self.write_packages()
        self.write_package_detail() # C'est ici que la décompression se passe
        self.write_dashboard()
        self.write_login()
        self.write_register()
        self.write_docs()
        self.write_badges()

        print("\n" + "="*60)
        print("✅ GÉNÉRATION TERMINÉE - PRÊT AU DÉPLOIEMENT")
        print("="*60)
        print(f"1. cd {self.root_dir}")
        print("2. git init")
        print("3. git add .")
        print("4. git commit -m 'Zenv Ultimate'")
        print("5. git push origin main")
        print("="*60)

    # =================================================================
    # CONFIGURATIONS ET ROUTING
    # =================================================================

    def write_package_json(self):
        content = """
{
  "name": "zenv-web-ultimate",
  "private": true,
  "version": "3.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "react-toastify": "^10.0.4",
    "lucide-react": "^0.330.0",
    "fflate": "^0.8.2", 
    "xterm": "^5.3.0",
    "xterm-addon-fit": "^0.8.0",
    "react-markdown": "^9.0.1",
    "date-fns": "^3.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.56",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.1.4"
  }
}
"""
        # Note: fflate est la librairie la plus rapide pour dézipper en JS
        self.write_file("package.json", content)

    def write_redirects(self):
        # FICHIER CRUCIAL POUR CLOUDFLARE PAGES (SPA ROUTING)
        self.write_file("public/_redirects", "/* /index.html 200")

    def write_vite_config(self):
        content = """
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    host: true
  }
})
"""
        self.write_file("vite.config.js", content)

    def write_index_html(self):
        content = """
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Zenv Package Hub</title>
    <!-- XTerm CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/xterm@5.3.0/css/xterm.min.css" />
    <style>
      body { background-color: #000; color: #fff; }
      .xterm-viewport { overflow-y: auto !important; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""
        self.write_file("index.html", content)

    # =================================================================
    # MOTEUR DE DÉCOMPRESSION (LE CŒUR TECHNIQUE)
    # =================================================================

    def write_archive_utils(self):
        content = """
import * as fflate from 'fflate';

/**
 * Télécharge une archive .zv (zip/tar) et extrait le README et le Manifeste
 * Ceci s'exécute côté CLIENT dans le navigateur.
 */
export const extractPackageData = async (url) => {
  try {
    // 1. Télécharger le blob binaire
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to download package archive");
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    return new Promise((resolve, reject) => {
      // 2. Décompression (supposons ZIP pour .zv standard, ou GZIP)
      // On essaie d'abord en tant que ZIP
      fflate.unzip(uint8Array, (err, unzipped) => {
        if (err) {
            // Si échec ZIP, c'est peut-être un tar.gz, mais restons simple pour l'exemple
            // Zenv CLI v2 utilise souvent ZIP par défaut pour .zv
            reject(err);
            return;
        }

        let readmeContent = null;
        let manifestContent = null;
        let fileList = [];

        // 3. Parcourir les fichiers extraits
        for (const [path, fileData] of Object.entries(unzipped)) {
            fileList.push({ path, size: fileData.length });
            
            const lower = path.toLowerCase();
            // Chercher README
            if (lower.includes('readme.md') || lower.includes('readme.txt')) {
                // Convertir Uint8Array en String
                readmeContent = new TextDecoder().decode(fileData);
            }
            // Chercher Manifeste
            if (lower.includes('package.zcf') || lower.includes('manifest.toml')) {
                manifestContent = new TextDecoder().decode(fileData);
            }
        }

        resolve({
            readme: readmeContent || "# No README found in archive",
            manifest: manifestContent || "# No manifest found",
            files: fileList
        });
      });
    });
  } catch (error) {
    console.error("Archive extraction failed:", error);
    return null;
  }
};
"""
        self.write_file("src/utils/archive.js", content)

    # =================================================================
    # TERMINAL XTERM (LE VRAI FEELING)
    # =================================================================

    def write_xterm_terminal(self):
        content = """
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { PackageService } from '../services/api';

const XTerminal = () => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const commandRef = useRef('');
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  // État du système simulé
  const sysState = useRef({
    zenvLangInstalled: false,
    zenvCoreInstalled: false
  });

  useEffect(() => {
    // Initialisation XTerm
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: '"Menlo", "Consolas", "Courier New", monospace',
      fontSize: 14,
      theme: {
        background: '#0a0a0a',
        foreground: '#f0f0f0',
        cursor: '#22c55e',
        selectionBackground: '#22c55e44'
      },
      rows: 16
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    if (terminalRef.current) {
      term.open(terminalRef.current);
      fitAddon.fit();
    }

    xtermRef.current = term;

    // Prompt
    const prompt = () => {
        term.write('\\r\\n\\x1b[1;32muser@mobile\\x1b[0m:\\x1b[1;34m~\\x1b[0m$ ');
    };

    term.writeln('\\x1b[1;36mZenv Hub Environment v3.0.0\\x1b[0m');
    term.writeln('Connected to https://zenv-hub.onrender.com');
    term.writeln('Type \\x1b[1;33mhelp\\x1b[0m to list commands.');
    prompt();

    // Gestion Clavier
    term.onData(e => {
      switch (e) {
        case '\\r': // Enter
          term.write('\\r\\n');
          processCommand(commandRef.current.trim());
          commandRef.current = '';
          break;
        case '\\u007F': // Backspace
          if (commandRef.current.length > 0) {
            commandRef.current = commandRef.current.slice(0, -1);
            term.write('\\b \\b');
          }
          break;
        default:
          if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E)) {
             commandRef.current += e;
             term.write(e);
          }
      }
    });

    const processCommand = async (cmd) => {
        const parts = cmd.split(' ');
        const main = parts[0];
        const arg1 = parts[1];
        const arg2 = parts[2];

        switch (main) {
            case '':
                break;
            case 'help':
                term.writeln('Available binaries:');
                term.writeln('  pip     Python Package Installer');
                term.writeln('  zenv    Zenv Base CLI');
                term.writeln('  znv     Zenv Core Logic');
                term.writeln('  clear   Clear terminal');
                break;
            
            case 'clear':
                term.clear();
                break;

            case 'pip':
                if (arg1 === 'install' && arg2 === 'zenv-lang') {
                    term.writeln('Collecting zenv-lang...');
                    term.writeln('Downloading zenv-lang-1.0.tar.gz (15 kB)');
                    await delay(500);
                    term.writeln('Installing collected packages: zenv-lang');
                    term.writeln('Successfully installed zenv-lang-1.0.0');
                    sysState.current.zenvLangInstalled = true;
                } else {
                    term.writeln('Usage: pip install zenv-lang');
                }
                break;

            case 'zenv':
                if (!sysState.current.zenvLangInstalled) {
                    term.writeln('bash: zenv: command not found (Install with pip first)');
                    break;
                }
                if (arg1 === 'install' && arg2 === 'zenv[core]') {
                    term.writeln('Resolving dependencies for zenv[core]...');
                    await delay(600);
                    term.writeln('Fetching core manifest from hub...');
                    term.writeln('Extracting core binaries...');
                    sysState.current.zenvCoreInstalled = true;
                    term.writeln('\\x1b[32mSuccess: zenv core installed. "znv" alias created.\\x1b[0m');
                } else {
                    term.writeln('Usage: zenv install zenv[core]');
                }
                break;

            case 'znv':
                if (!sysState.current.zenvCoreInstalled) {
                    term.writeln('bash: znv: command not found (Core not installed)');
                    break;
                }
                if (arg1 === 'search') {
                    if (!arg2) { term.writeln('Usage: znv search <query>'); break; }
                    term.writeln(`Searching Hub for "${arg2}"...`);
                    try {
                        const res = await PackageService.search(arg2);
                        if (res.data.packages && res.data.packages.length > 0) {
                            res.data.packages.forEach(p => {
                                term.writeln(`* ${p.name} (v${p.version})`);
                            });
                        } else {
                            term.writeln('No packages found.');
                        }
                    } catch (err) {
                        term.writeln('Error connecting to Hub API.');
                    }
                } else if (arg1 === 'version') {
                    term.writeln('Zenv Core v2.2.0 (Build 2025)');
                } else {
                    term.writeln('Unknown znv command. Try: search');
                }
                break;

            default:
                term.writeln(`bash: ${main}: command not found`);
        }
        prompt();
    };

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    return () => term.dispose();
  }, []);

  return <div ref={terminalRef} className="w-full h-full" />;
};

export default XTerminal;
"""
        self.write_file("src/components/Terminal.jsx", content)

    # =================================================================
    # PAGES CLÉS (DETAIL & HOME)
    # =================================================================

    def write_package_detail(self):
        content = """
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PackageService, BadgeService } from '../services/api';
import { extractPackageData } from '../utils/archive'; // Notre outil binaire
import Loader from '../components/Loader';
import ReactMarkdown from 'react-markdown';
import { Download, Box, FileText, Terminal } from 'lucide-react';

const PackageDetail = () => {
  const { name } = useParams();
  const [pkg, setPkg] = useState(null);
  const [readme, setReadme] = useState('');
  const [manifest, setManifest] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Infos API
        const res = await PackageService.getOne(name);
        const data = res.data.packages ? res.data.packages.find(p => p.name === name) : res.data;
        setPkg(data);

        if (data && data.version) {
            // 2. DÉCOMPRESSION RÉELLE DU .ZV
            const url = PackageService.downloadUrl(data.name, data.version);
            
            // On essaie de télécharger et extraire le binaire
            try {
                const extracted = await extractPackageData(url);
                if (extracted) {
                    setReadme(extracted.readme);
                    setManifest(extracted.manifest);
                    setFiles(extracted.files);
                } else {
                    // Fallback API si le binaire échoue (CORS ou autre)
                    const apiReadme = await PackageService.getReadme(name);
                    setReadme(apiReadme.data);
                }
            } catch (archiveErr) {
                console.warn("Binary extraction failed, falling back to API text", archiveErr);
                const apiReadme = await PackageService.getReadme(name);
                setReadme(apiReadme.data);
            }
        }
      } catch (err) {
        setError('Package not found or Hub offline.');
      }
      setLoading(false);
    };
    init();
  }, [name]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center p-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <Box className="text-blue-500"/> {pkg.name}
                </h1>
                <p className="text-gray-400 text-lg">{pkg.description}</p>
                <div className="flex gap-3 mt-4 text-sm font-mono text-gray-500">
                    <span className="bg-blue-900/20 text-blue-400 px-2 py-1 rounded">v{pkg.version}</span>
                    <span>{pkg.license}</span>
                    <span>{pkg.author}</span>
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <div className="bg-black p-3 rounded border border-gray-800 flex items-center gap-3 font-mono text-sm text-green-400">
                    <Terminal size={14} />
                    znv install {pkg.name}
                </div>
                <a href={PackageService.downloadUrl(pkg.name, pkg.version)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-bold text-center flex items-center justify-center gap-2">
                    <Download size={16}/> Download .zv
                </a>
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Colonne Gauche: README & Fichiers */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2 flex items-center gap-2">
                    <FileText size={20}/> README
                </h2>
                <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>{readme}</ReactMarkdown>
                </div>
            </div>

            {manifest && (
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Manifest (package.zcf)</h2>
                    <pre className="bg-black p-4 rounded text-sm text-gray-300 overflow-x-auto">
                        {manifest}
                    </pre>
                </div>
            )}
        </div>

        {/* Colonne Droite: Structure Fichiers */}
        <div className="space-y-6">
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                <h3 className="font-bold mb-4">Package Contents</h3>
                {files.length > 0 ? (
                    <ul className="text-sm font-mono space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                        {files.map((f, i) => (
                            <li key={i} className="flex justify-between text-gray-400">
                                <span>{f.path}</span>
                                <span className="text-gray-600">{f.size}b</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">Contents not loaded or package is empty.</p>
                )}
            </div>
            
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                <h3 className="font-bold mb-4">Badge</h3>
                <img src={BadgeService.getSvg(pkg.name)} alt="badge" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
"""
        self.write_file("src/pages/PackageDetail.jsx", content)

    # ------------------------------------------------------------------
    # UTILS & STANDARD FILES
    # ------------------------------------------------------------------

    def write_tailwind_config(self):
        self.write_file("tailwind.config.js", """
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography')],
}
""")
    
    def write_postcss_config(self):
        self.write_file("postcss.config.js", "export default { plugins: { tailwindcss: {}, autoprefixer: {} } }")

    def write_index_css(self):
        self.write_file("src/index.css", "@tailwind base; @tailwind components; @tailwind utilities; body { background: #000; color: #fff; }")

    def write_gitignore(self):
        self.write_file(".gitignore", "node_modules\ndist\n.env")

    def write_main_jsx(self):
        self.write_file("src/main.jsx", "import React from 'react'; import ReactDOM from 'react-dom/client'; import App from './App.jsx'; import './index.css'; ReactDOM.createRoot(document.getElementById('root')).render(<App />);")

    def write_app_jsx(self):
        # Configuration standard des routes
        content = """
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Docs from './pages/Docs';
import Badges from './pages/Badges';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-black">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/packages/:name" element={<PackageDetail />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/badges" element={<Badges />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer theme="dark" position="bottom-right"/>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
"""
        self.write_file("src/App.jsx", content)

    def write_api_service(self):
        # Service API connecté au backend Render
        content = f"""
import axios from 'axios';
const API = "{self.api_url}/api";
const api = axios.create({{ baseURL: API }});
api.interceptors.request.use(c => {{
    const t = localStorage.getItem('zenv_token');
    if(t) c.headers.Authorization = `Bearer ${{t}}`;
    return c;
}});

export const PackageService = {{
    getAll: () => api.get('/packages'),
    search: (q) => api.get('/packages/search', {{ params: {{ q }} }}),
    getOne: (n) => api.get(`/packages/${{n}}/latest`),
    getReadme: (n) => api.get(`/readme/${{n}}`),
    downloadUrl: (n, v) => `${{API}}/packages/download/${{n}}/${{v}}`
}};
export const AuthService = {{
    login: (d) => api.post('/auth/login', d),
    register: (d) => api.post('/auth/register', d),
    getProfile: () => api.get('/auth/profile'),
    generateToken: () => api.post('/tokens/generate')
}};
export const BadgeService = {{
    getSvg: (n) => `${{self.api_url}}/badge/svg/${{n}}`
}};
"""
        self.write_file("src/services/api.js", content)

    def write_auth_context(self):
        self.write_file("src/contexts/AuthContext.jsx", """
import React, {createContext, useContext, useState, useEffect} from 'react';
import {AuthService} from '../services/api';
const Ctx = createContext(null);
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const t = localStorage.getItem('zenv_token');
        if(t) AuthService.getProfile().then(r => setUser(r.data.user)).catch(()=>localStorage.removeItem('zenv_token')).finally(()=>setLoading(false));
        else setLoading(false);
    }, []);
    const login = (t, u) => { localStorage.setItem('zenv_token', t); setUser(u); };
    const logout = () => { localStorage.removeItem('zenv_token'); setUser(null); };
    return <Ctx.Provider value={{user, login, logout, loading}}>{children}</Ctx.Provider>;
};
export const useAuth = () => useContext(Ctx);
""")

    def write_navbar(self):
        self.write_file("src/components/Navbar.jsx", """
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {Menu, X, Terminal} from 'lucide-react';
export default function Navbar() {
    const {user} = useAuth();
    const [isOpen, setOpen] = useState(false);
    return (
        <nav className="border-b border-gray-800 bg-black/80 backdrop-blur sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                <Link to="/" className="font-bold text-xl flex items-center gap-2"><Terminal className="text-green-500"/> ZenvHub</Link>
                <div className="hidden md:flex gap-6 items-center">
                    <Link to="/packages" className="hover:text-blue-400">Packages</Link>
                    <Link to="/docs" className="hover:text-blue-400">Docs</Link>
                    {user ? <Link to="/dashboard" className="text-blue-400">Dashboard</Link> : <Link to="/login" className="bg-white text-black px-4 py-2 rounded font-bold">Login</Link>}
                </div>
                <button onClick={()=>setOpen(!isOpen)} className="md:hidden text-white"><Menu/></button>
            </div>
            {isOpen && <div className="md:hidden bg-gray-900 p-4 space-y-4 border-b border-gray-800">
                <Link to="/packages" className="block">Packages</Link>
                <Link to="/login" className="block">Login</Link>
            </div>}
        </nav>
    );
}
""")

    def write_footer(self):
        self.write_file("src/components/Footer.jsx", "export default function Footer(){return <footer className='border-t border-gray-800 py-8 text-center text-gray-500'>© 2025 Zenv Hub Ultimate</footer>}")

    def write_loader(self):
        self.write_file("src/components/Loader.jsx", "export default function Loader(){return <div className='p-10 text-center text-blue-500'>Loading Zenv Protocol...</div>}")

    def write_protected_route(self):
        self.write_file("src/components/ProtectedRoute.jsx", "import {useAuth} from '../contexts/AuthContext'; import {Navigate} from 'react-router-dom'; export default function PR({children}){ const {user,loading}=useAuth(); if(loading)return null; return user?children:<Navigate to='/login'/>; }")

    # --- PAGES RAPIDES ---
    def write_home(self):
        content = """
import React from 'react';
import XTerminal from '../components/Terminal';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <div className="text-center pt-20 pb-10 px-4">
                <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">ZENV PROTOCOL</h1>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
                    Next-generation package manager for Python. Secure, Fast, and Binary-optimized.
                </p>
                <div className="flex justify-center gap-4 mb-16">
                    <Link to="/packages" className="bg-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-700">Explore Hub</Link>
                    <Link to="/docs" className="border border-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-800">Read Docs</Link>
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto px-4 mb-20">
                <div className="bg-[#0a0a0a] rounded-lg border border-gray-800 overflow-hidden shadow-2xl h-[400px]">
                    <div className="bg-[#1e1e1e] px-4 py-2 border-b border-gray-800 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="h-full p-2">
                        <XTerminal />
                    </div>
                </div>
                <p className="text-center text-gray-600 text-sm mt-4">Interactive Web Terminal • Try typing <span className="text-green-500">pip install zenv-lang</span></p>
            </div>
        </div>
    );
};
export default Home;
"""
        self.write_file("src/pages/Home.jsx", content)

    def write_packages(self):
        self.write_file("src/pages/Packages.jsx", """
import React, {useEffect, useState} from 'react';
import {PackageService} from '../services/api';
import {Link} from 'react-router-dom';
import {Box} from 'lucide-react';
export default function Packages() {
    const [pkgs, setPkgs] = useState([]);
    useEffect(()=>{PackageService.getAll().then(r=>setPkgs(r.data.packages||[]))},[]);
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Packages Index</h1>
            <div className="grid md:grid-cols-3 gap-4">
                {pkgs.map(p=>(
                    <Link key={p.name} to={`/packages/${p.name}`} className="bg-[#18181b] p-6 rounded-xl border border-gray-800 hover:border-blue-500">
                        <div className="flex items-center gap-2 mb-2 text-xl font-bold"><Box className="text-blue-500"/> {p.name}</div>
                        <p className="text-gray-400 text-sm">{p.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
""")

    def write_dashboard(self):
        self.write_file("src/pages/Dashboard.jsx", "import React from 'react'; import {useAuth} from '../contexts/AuthContext'; export default function Dashboard(){const {user}=useAuth(); return <div className='p-20 text-center'><h1 className='text-3xl font-bold'>Dashboard</h1><p>Welcome {user.username}</p></div>}")

    def write_login(self):
        self.write_file("src/pages/Login.jsx", "import React from 'react'; import {useAuth} from '../contexts/AuthContext'; import {AuthService} from '../services/api'; import {useNavigate} from 'react-router-dom'; export default function Login(){ const {login}=useAuth(); const nav=useNavigate(); const handle=async(e)=>{e.preventDefault(); const res=await AuthService.login({username:e.target[0].value,password:e.target[1].value}); login(res.data.token.access_token, res.data.user); nav('/dashboard'); }; return <div className='p-20 flex justify-center'><form onSubmit={handle} className='bg-gray-900 p-8 rounded space-y-4'><h1 className='text-2xl'>Login</h1><input className='block w-full bg-black p-2 border border-gray-700' placeholder='Username'/><input type='password' className='block w-full bg-black p-2 border border-gray-700' placeholder='Password'/><button className='bg-blue-600 w-full p-2'>Login</button></form></div> }")

    def write_register(self):
        self.write_file("src/pages/Register.jsx", "import React from 'react'; export default function Register(){return <div className='p-20 text-center'>Register Page</div>}")

    def write_docs(self):
        self.write_file("src/pages/Docs.jsx", "import React from 'react'; export default function Docs(){return <div className='p-20 max-w-3xl mx-auto prose prose-invert'><h1>Docs</h1><p>Install Zenv via pip.</p></div>}")

    def write_badges(self):
        self.write_file("src/pages/Badges.jsx", "import React from 'react'; export default function Badges(){return <div className='p-20 text-center'>Badges</div>}")

if __name__ == "__main__":
    UltimateGenerator().generate()