import axios from 'axios';

const API_URL = "https://zenv-hub.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zenv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const PackageService = {
  getAll: () => api.get('/packages'),
  search: (q) => api.get('/packages/search', { params: { q } }),
  getOne: (name, v) => api.get(`/packages/${name}/${v || 'latest'}`),
  getReadme: (name) => api.get(`/readme/${name}`),
};

export const AuthService = {
  login: (creds) => api.post('/auth/login', creds),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  generateToken: () => api.post('/tokens/generate')
};

export const BadgeService = {
  getSvg: (name) => `${self.api_url}/badge/svg/${name}`
};

export default api;