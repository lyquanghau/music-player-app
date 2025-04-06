// src/components/LandingPage.js
import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import LeftSection from "./LeftSection";
import Effects from "./particles/effect";
import SocialIcons from "./particles/SocialIcons";
import "../assets/css/LandingPage.css"; // Import CSS mới

const LandingPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      console.log("Login successful");
      navigate("/home"); // Chuyển sang /home thay vì /player
    } catch (error) {
      console.error("Login error:", error);
      alert("Đăng nhập thất bại! Kiểm tra thông tin đăng nhập.");
    }
  };

  return (
    <div className="landing-page">
      <SocialIcons />
      <LeftSection />
      <div className="right-section">
        <div className="login-form">
          <h2>Đăng nhập</h2>
          <p>Tham gia gia cùng chúng tôi để trải nghiệm âm nhạc đỉnh cao!</p>
          <form onSubmit={handleLoginSubmit}>
            <div className="input-container">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-container">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div style={{ textAlign: "center", margin: "24px 0" }}>
              <a href="/reset-password">Quên mật khẩu?</a>
            </div>
            <button type="submit">Đăng nhập</button>
          </form>
          <div style={{ textAlign: "center", margin: "24px 0" }}>
            <p>
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
          </div>
          <div className="social-buttons">
            <button
              className="google-button"
              onClick={() => console.log("Google login clicked")}
            >
              <i className="fab fa-google"></i> Login with Google
            </button>
            <button
              className="facebook-button"
              onClick={() => console.log("Facebook login clicked")}
            >
              <i className="fab fa-facebook"></i> Login with Facebook
            </button>
          </div>
          <div className="footer-text">
            © 2025 Sky Music | "Âm nhạc không giới hạn"
          </div>
          <div className="footer-text">Design by Quang Hậu</div>
        </div>
      </div>
      <Effects />
    </div>
  );
};

export default LandingPage;
