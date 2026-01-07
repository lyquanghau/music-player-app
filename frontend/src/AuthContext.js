// src/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8404";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check token khi app khởi động
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // ✅ DÙNG exp – CHUẨN JWT
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
    }
  }, []);

  const signup = async (username, password) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      username,
      password,
    });
    return response.data;
  };

  const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      username,
      password,
    });

    const { token } = response.data;
    if (!token) throw new Error("No token received");

    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);
    const userData = {
      id: decoded.id,
      username: decoded.username,
    };

    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
