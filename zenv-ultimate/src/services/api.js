import axios from 'axios';

// L'URL exacte de ton backend Render
const API_URL = "https://zenv-hub.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 60000 // 60 secondes d'attente (pour le réveil de Render)
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zenv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export const PackageService = {
  getAll: () => api.get('/packages'),
  search: (q) => api.get('/packages/search', { params: { q } }),
  // On utilise l'endpoint spécifique version ou latest
  getOne: (name) => api.get(`/packages/${name}/latest`).catch(() => api.get(`/packages/search?q=${name}`)),
  // Endpoint texte direct (plus sûr que le téléchargement binaire)
  getReadme: (name) => api.get(`/readme/${name}`),
  downloadUrl: (name, v) => `${API_URL}/packages/download/${name}/${v}`
};

export const AuthService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  generateToken: () => api.post('/tokens/generate')
};

export const BadgeService = {
  getSvg: (name) => `https://zenv-hub.onrender.com/badge/svg/${name}`
};

export const HealthService = {
  check: () => api.get('/version')
};

export default api;