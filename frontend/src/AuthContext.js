// src/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Thêm jwt-decode để giải mã token

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
        // Kiểm tra token có hết hạn không
        const currentTime = Date.now() / 1000; // Thời gian hiện tại (giây)
        if (decoded.exp < currentTime) {
          localStorage.removeItem("token"); // Xóa token nếu hết hạn
        } else {
          setUser({ id: decoded.id }); // Cập nhật user từ token
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser({ id: decoded.id, username });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
