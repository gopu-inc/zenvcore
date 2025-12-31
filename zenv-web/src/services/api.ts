import axios from "axios"

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
