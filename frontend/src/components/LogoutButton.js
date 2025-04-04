// src/components/LogoutButton.js
import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Xóa token và đặt user về null
    navigate("/"); // Chuyển về trang đăng nhập
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "8px 16px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "0.9rem",
        transition: "background-color 0.3s",
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
    >
      Đăng xuất
    </button>
  );
};

export default LogoutButton;
