import axios from "axios";
import { BASE_URL } from "../utils/constants";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: BASE_URL[import.meta.env.MODE],
  headers: {
    "content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/"
      toast.error("Session expired. Please login again.");
    }
    return Promise.reject(error);
  }
);

export default api;
