// src/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8404";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Kiểm tra token khi ứng dụng khởi động
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const testExpiryTime = decoded.iat + 1000; // iat = thời điểm token được tạo

        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser({ id: decoded.id });

          // Tự động logout sau 30s (tuỳ chọn)
          const timeLeft = (testExpiryTime - currentTime) * 1000;
          setTimeout(logout, timeLeft);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  const signup = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        username,
        password,
      });
      return response.data; // Trả về dữ liệu từ server (message, user)
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password,
      });
      const { token } = response.data;
      if (!token) throw new Error("No token received from server");
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      const userData = {
        id: decoded.id,
        username: decoded.username || username,
      };
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
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
