import axios from 'axios';

const API_URL = "https://zenv-hub.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zenv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const PackageService = {
  getAll: () => api.get('/packages'),
  search: (query) => api.get('/packages/search', { params: { q: query } }),
  getOne: (name, version) => api.get(`/packages/${name}/${version || 'latest'}`),
  getReadme: (name) => api.get(`/readme/${name}`),
  download: (name, version) => `${API_URL}/packages/download/${name}/${version}`
};

export const AuthService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  verifyToken: (token) => api.get(`/tokens/verify?token=${token}`)
};

export const BadgeService = {
  getAll: () => api.get('/badges'),
  create: (data) => api.post('/badges', data),
  createWithLogo: (data) => api.post('/badges/with-logo', data),
  getSvgUrl: (name) => `${self.api_url}/badge/svg/${name}`
};

export default api;