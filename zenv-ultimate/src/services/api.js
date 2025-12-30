import axios from 'axios';
const API = "https://zenv-hub.onrender.com/api";
const api = axios.create({ baseURL: API });
api.interceptors.request.use(c => {
    const t = localStorage.getItem('zenv_token');
    if(t) c.headers.Authorization = `Bearer ${t}`;
    return c;
});

export const PackageService = {
    getAll: () => api.get('/packages'),
    search: (q) => api.get('/packages/search', { params: { q } }),
    getOne: (n) => api.get(`/packages/${n}/latest`),
    getReadme: (n) => api.get(`/readme/${n}`),
    downloadUrl: (n, v) => `${API}/packages/download/${n}/${v}`
};
export const AuthService = {
    login: (d) => api.post('/auth/login', d),
    register: (d) => api.post('/auth/register', d),
    getProfile: () => api.get('/auth/profile'),
    generateToken: () => api.post('/tokens/generate')
};
export const BadgeService = {
    getSvg: (n) => `${self.api_url}/badge/svg/${n}`
};