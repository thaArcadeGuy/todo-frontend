import api from "./api";
import toast from "react-hot-toast"

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      toast.success("Registration successful!")
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  },

  login: async(credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      toast.success("Login successful!");
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    toast.success("logged out successfully");
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      return null;
    }
  }
};