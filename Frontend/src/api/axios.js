import axios from "axios";

// Ensure base URL ends with a slash
const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5009/";

const api = axios.create({
  baseURL: `${baseURL}api/`, // adds "api/" correctly
  withCredentials: true,
});

// Automatically attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
