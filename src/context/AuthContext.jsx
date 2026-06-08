import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to load user profile if token exists
  const loadUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const persistSession = (data) => {
    localStorage.setItem("access_token", data.access);
    if (data.refresh) {
      localStorage.setItem("refresh_token", data.refresh);
    } else {
      localStorage.removeItem("refresh_token");
    }
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    persistSession(response.data);
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  };

  const verifyEmail = async (email, token) => {
    const response = await api.post("/auth/verify-email", {
      email: email.trim(),
      token: String(token).trim(),
    });
    persistSession(response.data);
    return response.data;
  };

  const resendVerificationEmail = async (email) => {
    const response = await api.post("/auth/resend-verification", {
      email: email.trim(),
    });
    return response.data;
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        await api.post("/auth/logout", { refresh });
      }
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    verifyEmail,
    resendVerificationEmail,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
