import api from "./api";
import toast from "react-hot-toast"
import type { User, LoginCredentials } from "../contexts/AuthContext";
import type { SignupFormData } from "../components/auth/SignupForm";

type AuthResponse = {
  accessToken: string,
  user: User
}

type ApiError = {
  response?: {
    data?: {
      message?: string
    }
  }
}

const isApiError = (error: unknown): error is ApiError => {
  return typeof error === "object" && error !== null && "response" in error;
};

export const authService = {
  register: async (userData: SignupFormData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/register", userData);
      toast.success("Registration successful!")
      return response.data
    } catch (error) {
      const message = isApiError(error) 
        ? error.response?.data?.message
        : undefined
      toast.error(message || "Registration failed");
      throw error;
    }
  },

  login: async(credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      toast.success("Login successful!");
      return response.data
    } catch (error) {
      const message = isApiError(error)
        ? error.response?.data?.message
        : undefined
      toast.error(message || "Login failed");
      throw error
    }
  },

  logout: (): void => {
    localStorage.removeItem("token");
    toast.success("logged out successfully");
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get<User>("/auth/me");
      return response.data;
    } catch {
      return null;
    }
  }
};