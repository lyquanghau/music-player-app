// src/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "./api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const token = user ? localStorage.getItem("token") : null;
  useEffect(() => {
    const interceptor = api.interceptors.response.use(undefined, error => {
      if (token && error.response?.status === 401 &&
          error.config?.headers?.Authorization === `Bearer ${token}` &&
          localStorage.getItem("token") === token) {
        localStorage.removeItem("token");
        setUser(null);
      }
      return Promise.reject(error);
    });
    return () => api.interceptors.response.eject(interceptor);
  }, [token]);
  const [loading, setLoading] = useState(true); // 🔥 QUAN TRỌNG

  // Check token khi app khởi động
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        setUser(null);
      } else {
        setUser({
          id: decoded.id,
          username: decoded.username,
        });
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Register
  const signup = async (username, password) => {
    const res = await api.post("/auth/register", {
      username,
      password,
    });
    return res.data;
  };

  // Login
  const login = async (username, password) => {
    const res = await api.post("/auth/login", {
      username,
      password,
    });

    const { token } = res.data;
    if (!token) {
      throw new Error("No token received from server");
    }

    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);
    const userData = {
      id: decoded.id,
      username: decoded.username,
    };

    setUser(userData);
    return userData;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
