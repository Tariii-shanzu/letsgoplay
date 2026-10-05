import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authApi = {
  register: (payload: { email: string; password: string; name?: string }) =>
    api.post("/auth/register", payload),
  login: (payload: { email: string; password: string }) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
};

export const proxyApi = {
  list: () => api.get("/proxies"),
  create: (payload: { name: string; targetUrl: string; protocol?: string; status?: string }) =>
    api.post("/proxies", payload),
  update: (id: string, payload: Partial<any>) => api.put(`/proxies/${id}`, payload),
  remove: (id: string) => api.delete(`/proxies/${id}`),
};

export default api;
