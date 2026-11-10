import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080" });

// Har request mein token automatically lagao
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Token expire/invalid ho (401) to login page par bhejo
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !location.pathname.startsWith("/login")) {
      localStorage.clear();
      location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Backend ke error response se readable message nikalo
export const errMsg = (e) => {
  const m = e.response?.data?.message;
  if (!m) return e.message || "Something went wrong";
  return typeof m === "string" ? m : Object.values(m).join(", ");
};

export default api;
