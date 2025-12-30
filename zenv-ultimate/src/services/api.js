import axios from 'axios';

const API_URL = "https://zenv-hub.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 40000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zenv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const API = {
  // Récupère tout et filtre
  getPackages: async () => {
    // Si /api/packages échoue, on tente la racine au cas où
    try {
        const res = await api.get('/api/packages');
        return res.data.packages || res.data || [];
    } catch {
        return [];
    }
  },
  
  // CORRECTION README: Force le texte brut pour analyse
  getReadme: (name) => api.get(`/api/readme/${name}`, { responseType: 'text' }),
  
  auth: {
    // Force le JSON strict pour Python
    login: (data) => api.post('/api/auth/login', JSON.stringify(data)),
    register: (data) => api.post('/api/auth/register', JSON.stringify(data)),
    profile: () => api.get('/api/auth/profile'),
    genToken: () => api.post('/api/tokens/generate')
  }
};