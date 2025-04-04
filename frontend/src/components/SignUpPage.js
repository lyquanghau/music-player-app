import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import LeftSection from "./LeftSection";
import Effects from "./particles/effect";
import SocialIcons from "./particles/SocialIcons";

const SignUpPage = () => {
  const { signup, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  // Hiệu ứng hiển thị thông báo
  useEffect(() => {
    if (message) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
        setMessage("");
      }, 3000); // Ẩn sau 3 giây
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Mật khẩu không khớp!");
      return;
    }
    try {
      await signup(username, password);
      await login(username, password); // Tự động đăng nhập
      setMessage(
        "Đăng ký thành công! Bạn sẽ được chuyển đến trang chính trong giây lát."
      );
      setTimeout(() => {
        navigate("/player");
      }, 2000); // Chuyển hướng sau 2 giây
    } catch (error) {
      setMessage(error.response?.data?.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <SocialIcons />
      <LeftSection />

      {/* Thanh trượt thông báo */}
      {showNotification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: showNotification ? "20px" : "-300px",
            background: message.includes("thành công") ? "#28a745" : "#ff6b6b",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "5px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            transition: "right 0.5s ease-in-out",
            maxWidth: "300px",
            fontSize: "0.9rem",
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          flex: 1,
          padding: "10px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "35%",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            padding: "25px",
            width: "100%",
            maxWidth: "280px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: "1.3rem",
              textAlign: "center",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            Đăng ký
          </h2>
          <p
            style={{
              color: "#fff",
              fontSize: "0.8rem",
              textAlign: "center",
              marginBottom: "15px",
              opacity: 0.8,
            }}
          >
            Tạo tài khoản để khám phá âm nhạc không giới hạn!
          </p>
          <form onSubmit={handleSignUp}>
            <div style={{ position: "relative", margin: "16px 0" }}>
              <i
                className="fas fa-user"
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#fff",
                  opacity: 0.7,
                }}
              ></i>
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 10px 10px 35px",
                  borderRadius: "4px",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "background 0.3s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) =>
                  (e.target.style.background = "rgba(255, 255, 255, 0.3)")
                }
                onBlur={(e) =>
                  (e.target.style.background = "rgba(255, 255, 255, 0.2)")
                }
              />
            </div>
            <div style={{ position: "relative", margin: "16px 0" }}>
              <i
                className="fas fa-lock"
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#fff",
                  opacity: 0.7,
                }}
              ></i>
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 10px 10px 35px",
                  borderRadius: "4px",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "background 0.3s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) =>
                  (e.target.style.background = "rgba(255, 255, 255, 0.3)")
                }
                onBlur={(e) =>
                  (e.target.style.background = "rgba(255, 255, 255, 0.2)")
                }
              />
            </div>
            <div style={{ position: "relative", margin: "16px 0" }}>
              <i
                className="fas fa-lock"
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#fff",
                  opacity: 0.7,
                }}
              ></i>
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 10px 10px 35px",
                  borderRadius: "4px",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "background 0.3s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) =>
                  (e.target.style.background = "rgba(255, 255, 255, 0.3)")
                }
                onBlur={(e) =>
                  (e.target.style.background = "rgba(255, 255, 255, 0.2)")
                }
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "none",
                background: "#1e90ff",
                color: "#fff",
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "background 0.3s",
                animation: "pulse 2s infinite",
              }}
              onMouseOver={(e) => (e.target.style.background = "#4682b4")}
              onMouseOut={(e) => (e.target.style.background = "#1e90ff")}
            >
              Đăng ký
            </button>
          </form>
          <div style={{ textAlign: "center", margin: "24px 0" }}>
            <p style={{ color: "#fff", fontSize: "0.9rem" }}>
              Đã có tài khoản?{" "}
              <Link
                to="/"
                style={{ color: "#1e90ff", textDecoration: "underline" }}
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <button
              style={{
                background: "#db4437",
                color: "white",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
              onClick={() => {
                console.log("Google sign up clicked");
              }}
            >
              <i className="fab fa-google"></i> Sign up with Google
            </button>
            <button
              style={{
                background: "#4267B2",
                color: "white",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
              onClick={() => {
                console.log("Facebook sign up clicked");
              }}
            >
              <i className="fab fa-facebook"></i> Sign up with Facebook
            </button>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "15px",
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "0.65rem",
              lineHeight: "1.2",
            }}
          >
            © 2025 Sky Music | "Âm nhạc không giới hạn"
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "5px",
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "0.65rem",
              lineHeight: "1.2",
            }}
          >
            Design by Quang Hậu
          </div>
        </div>
      </div>

      <Effects />

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }

          @media (max-width: 768px) {
            div[style*="display: flex"] {
              flex-direction: column;
            }
            div[style*="flex: 1"] {
              flex: none;
              width: "100%";
            }
            div[style*="flexDirection: row"] {
              flex-direction: column;
              align-items: center;
            }
            div[style*="maxWidth: '35%'"] {
              max-width: 90%;
            }
            p[style*="fontSize: '1rem'"] {
              font-size: 0.8rem;
            }
            div[style*="fontSize: '1.1rem'"] {
              font-size: 0.9rem;
            }
            div[style*="position: 'absolute'"][style*="top: '20px'"] {
              top: 10px;
              left: 10px;
              gap: 10px;
            }
            i[class*="fa-"][style*="fontSize: '24px'"] {
              font-size: 20px !important;
            }
          }

          @media (min-width: 1200px) {
            img[style*="width: '20vw'"] {
              width: 15vw;
            }
            div[style*="maxWidth: '35%'"] {
              maxWidth: 30%;
            }
            div[style*="width: '15vw'"] {
              width: 12vw;
            }
          }
        `}
      </style>
    </div>
  );
};

export default SignUpPage;
