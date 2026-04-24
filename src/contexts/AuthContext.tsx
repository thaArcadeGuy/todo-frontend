import { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import type { SignupFormData } from "../components/auth/SignupForm";
import type { JSX } from "react"

type User = {
  id: string,
  name: string,
  email: string
}

type LoginCredentials = {
  email: string,
  password: string
}

type AuthContextType = {
  user: User | null,
  loading: boolean,
  login: (credentials: LoginCredentials) => Promise<void>,
  register: (userData: SignupFormData) => Promise<void>,
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderComponent({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token")
    }
  }, [token])

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        const userData: User = await authService.getCurrentUser();
        setUser(userData);
      }
      setLoading(false);
    };
    loadUser()
  }, [token]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const data = await authService.login(credentials);
    setToken(data.accessToken);
    setUser(data.user);
  };

  const register = async (userData: SignupFormData): Promise<void> => {
    const data = await authService.register(userData);
    setToken(data.accessToken);
    setUser(data.user)
  };

  const logout = (): void => {
    authService.logout();
    setToken(null);
    setUser(null)
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProviderComponent.displayName = "AuthProvider";
export const AuthProvider = AuthProviderComponent;