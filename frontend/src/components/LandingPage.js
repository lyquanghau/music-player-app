import React, { useState } from "react"; // Thêm useState
import { useAuth } from "../AuthContext"; // Đúng đường dẫn

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
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Bên trái: Poster */}
      <div style={{ flex: 1, background: "#f0f0f0" }}>
        <img
          src="https://via.placeholder.com/600x800?text=Poster"
          alt="Poster"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Bên phải: Đăng nhập/Đăng ký */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2>Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ display: "block", margin: "10px 0", padding: "8px" }}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: "block", margin: "10px 0", padding: "8px" }}
          />
          <button type="submit" style={{ padding: "8px 16px" }}>
            Đăng nhập
          </button>
        </form>
        <p>
          Chưa có tài khoản? <a href="/register">Đăng ký</a>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
