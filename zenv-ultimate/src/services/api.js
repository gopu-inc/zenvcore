import axios from 'axios';

// URL Backend
const API_URL = "https://zenv-hub.onrender.com"; // Pas de /api ici, on l'ajoute après si besoin, ou selon tes routes

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 40000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zenv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const PackageService = {
  // Récupère TOUT et renvoie la liste
  getAll: async () => {
    // Ton backend sert sur /api/packages
    const res = await api.get('/api/packages');
    return res.data.packages || []; 
  },

  // Simulation de recherche côté client (car pas de route search sur le backend)
  search: async (query) => {
    const res = await api.get('/api/packages');
    const all = res.data.packages || [];
    if (!query) return all;
    return all.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  },

  // Trouve un paquet spécifique via la liste globale
  getOne: async (name) => {
    const res = await api.get('/api/packages');
    const all = res.data.packages || [];
    const found = all.find(p => p.name === name);
    if (!found) throw new Error("Package not found");
    return found;
  },

  getReadme: (name) => api.get(`/api/readme/${name}`),
  
  // Construction de l'URL de téléchargement
  downloadUrl: (name, v) => `${API_URL}/api/packages/download/${name}/${v}`
};

export const AuthService = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  getProfile: () => api.get('/api/auth/profile'),
  generateToken: () => api.post('/api/tokens/generate')
};

export const BadgeService = {
  getSvg: (name) => `${API_URL}/badge/svg/${name}`
};

export default api;