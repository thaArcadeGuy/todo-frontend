import { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();



function AuthProviderComponent({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"))

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
      setLoading(false);
    };
    loadUser()
  }, [token]);

  const login = async (credentials) => {
    const data = await authService.login(credentials)
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setToken(data.token);
    setUser(data.user)
  };

  const logout = () => {
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