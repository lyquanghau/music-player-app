import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import loginBackground from "../assets/login.png"; // Đường dẫn đến hình login.png

const LandingPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundImage: `url(${loginBackground})`, // Sử dụng login.png làm nền
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Bên trái: Biểu tượng hoặc không gian trống */}
      <div style={{ flex: 1 }}></div>

      {/* Bên phải: Form đăng nhập */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)", // Nền trong suốt kiểu glassmorphism
            backdropFilter: "blur(10px)", // Hiệu ứng mờ
            borderRadius: "15px",
            padding: "30px",
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: "2rem",
              textAlign: "center",
              marginBottom: "20px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Sky Music
          </h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                margin: "10px 0",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                background: "rgba(255, 255, 255, 0.2)",
                color: "#fff",
                fontSize: "1rem",
                outline: "none",
                fontFamily: "Arial, sans-serif",
              }}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                margin: "10px 0",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                background: "rgba(255, 255, 255, 0.2)",
                color: "#fff",
                fontSize: "1rem",
                outline: "none",
                fontFamily: "Arial, sans-serif",
              }}
            />
            <div style={{ textAlign: "center", margin: "10px 0" }}>
              <a
                href="/reset-password"
                style={{
                  color: "#fff",
                  fontSize: "0.9rem",
                  textDecoration: "underline",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Quên mật khẩu?
              </a>
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                background: "rgba(255, 255, 255, 0.3)",
                color: "#fff",
                fontSize: "1rem",
                cursor: "pointer",
                fontFamily: "Arial, sans-serif",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.5)")
              }
              onMouseOut={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.3)")
              }
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
