import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import LeftSection from "./LeftSection"; // Thêm import cho LeftSection

const SignUpPage = () => {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }
    try {
      await signup(username, password); // Gọi hàm signup
    } catch (error) {
      alert("Đăng ký thất bại. Vui lòng thử lại!");
      console.error("Sign up failed:", error);
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
      <div
        style={{
          position: "absolute",
          top: "20px", // Khoảng cách từ đỉnh
          left: "20px", // Khoảng cách từ bên trái
          display: "flex",
          gap: "15px", // Khoảng cách giữa các icon
          zIndex: 10, // Đảm bảo icon nằm trên các phần tử khác
        }}
      >
        {/* Icon Global */}
        <a
          href="https://your-personal-website.com" // Thay bằng link trang web cá nhân của bạn
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#fff",
            opacity: 0.7,
            transition: "opacity 0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1.2)"; // Phóng to khi hover
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = "0.7";
            e.currentTarget.style.transform = "scale(1)"; // Trở lại kích thước ban đầu
          }}
          title="Visit my website"
        >
          <i className="fas fa-globe" style={{ fontSize: "18px" }}></i>
        </a>

        {/* Icon Facebook */}
        <a
          href="https://www.facebook.com/quang.hau.749246/?locale=vi_VN" // Thay bằng link Facebook của bạn
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#4267B2",
            opacity: 0.7,
            transition: "opacity 0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1.2)"; // Phóng to khi hover
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = "0.7";
            e.currentTarget.style.transform = "scale(1)"; // Trở lại kích thước ban đầu
          }}
          title="Follow me on Facebook"
        >
          <i className="fab fa-facebook" style={{ fontSize: "18px" }}></i>
        </a>

        {/* Icon Instagram */}
        <a
          href="https://www.instagram.com/lyqhau_8th4/" // Thay bằng link Instagram của bạn
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#E95950",
            opacity: 0.7,
            transition: "opacity 0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1.2)"; // Phóng to khi hover
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = "0.7";
            e.currentTarget.style.transform = "scale(1)"; // Trở lại kích thước ban đầu
          }}
          title="Follow me on Instagram"
        >
          <i className="fab fa-instagram" style={{ fontSize: "18px" }}></i>
        </a>

        {/* Icon GitHub */}
        <a
          href="https://github.com/lyquanghau" // Thay bằng link GitHub của bạn
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#171515",
            opacity: 0.7,
            transition: "opacity 0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1.2)"; // Phóng to khi hover
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = "0.7";
            e.currentTarget.style.transform = "scale(1)"; // Trở lại kích thước ban đầu
          }}
          title="Visit my GitHub"
        >
          <i className="fab fa-github" style={{ fontSize: "18px" }}></i>
        </a>
      </div>

      {/* Bên trái: Logo, slogan, widget, và nội dung bổ sung */}
      <LeftSection />

      {/* Bên phải: Form đăng nhập */}
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
            {/* <div style={{ position: "relative", margin: "16px 0" }}>
              <i
                className="fas fa-envelope"
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
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            </div> */}
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

          {/* Nút đăng ký bằng Google và Facebook */}
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

      {/* Hiệu ứng đám mây, nốt nhạc, tai nghe, sóng âm thanh, hạt lấp lánh */}
      <style>
        {`
          /* Đám mây với các hình dạng khác nhau */
          .cloud1 {
            position: absolute;
            width: 120px;
            height: 50px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 60px;
            animation: floatLeftToRight 8s infinite linear;
          }
          .cloud1::before {
            content: '';
            position: absolute;
            width: 70px;
            height: 70px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            top: -35px;
            left: 25px;
          }
          .cloud1::after {
            content: '';
            position: absolute;
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            top: -25px;
            right: 20px;
          }

          .cloud2 {
            position: absolute;
            width: 150px;
            height: 40px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50px;
            animation: floatRightToLeft 10s infinite linear;
          }
          .cloud2::before {
            content: '';
            position: absolute;
            width: 80px;
            height: 60px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            top: -30px;
            left: 30px;
          }

          .cloud3 {
            position: absolute;
            width: 90px;
            height: 30px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 40px;
            animation: floatLeftToRight 9s infinite linear;
          }
          .cloud3::after {
            content: '';
            position: absolute;
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            top: -25px;
            left: 20px;
          }

          /* Nốt nhạc, tai nghe, và sóng âm thanh */
          .note, .headphone, .soundwave {
            position: absolute;
            font-size: 4rem;
            color: #fff;
            animation: floatUpDown 3s infinite linear;
          }
          .headphone {
            font-size: 2.5rem;
            animation: floatUpDown 3s infinite linear;
          }
          .soundwave {
            font-size: 2rem;
            animation: floatUpDown 2s infinite linear;
          }

          /* Hạt lấp lánh */
          .particle {
            position: absolute;
            width: 5px;
            height: 5px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            animation: sparkle 10s infinite linear;
          }

          /* Hoạt ảnh cho các đám mây di chuyển từ trái qua phải */
          @keyframes floatLeftToRight {
            0% { transform: translateX(-150%) translateY(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateX(150vw) translateY(20px); opacity: 0; }
          }

          /* Hoạt ảnh cho các đám mây di chuyển từ phải qua trái */
          @keyframes floatRightToLeft {
            0% { transform: translateX(150vw) translateY(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateX(-150%) translateY(-20px); opacity: 0; }
          }

          /* Hoạt ảnh cho các nốt nhạc, tai nghe, sóng âm thanh */
          @keyframes floatUpDown {
            0% { transform: translateY(100vh); opacity: 1; }
            20% { opacity: 1; }
            40% { opacity: 0.9; }
            60% { opacity: 0.6; }
            80% { opacity: 0.3; }
            100% { transform: translateY(-50%); opacity: 0; }
          }

          /* Hoạt ảnh cho hạt lấp lánh */
          @keyframes sparkle {
            0% { transform: translateY(100vh) scale(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-50vh) scale(1); opacity: 0; }
          }

          {/* Hiệu ứng cho logo */}
          /* Animation cho logo tự động phóng to thu nhỏ */
          @keyframes scalePulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }

          .soundwave-effect {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            transform: translate(-50%, -50%);
            pointer-events: none; /* Đảm bảo không chặn tương tác với logo */
            opacity: 1; /* Hiển thị tự động */
          }

          .soundwave-effect::before,
          .soundwave-effect::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 120%;
            height: 120%;
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: wave 1.5s infinite;
          }

          .soundwave-effect::after {
            animation-delay: 0.5s;
          }

          @keyframes wave {
            0% {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 0.5;
            }
            100% {
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 0;
            }
          }

          /* Hiệu ứng pulse cho nút đăng nhập */
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }

          /* Responsive: Điều chỉnh cho màn hình nhỏ */
          @media (max-width: 768px) {
            div[style*="display: flex"] {
              flex-direction: column;
            }
            div[style*="flex: 1"] {
              flex: none;
              width: 100%;
            }
            div[style*="flexDirection: row"] {
              flex-direction: column;
              align-items: center;
            }
            div[style*="maxWidth: '35%']"] { // Cập nhật để khớp với maxWidth mới
              max-width: 90%;
            }
            p[style*="fontSize: '1rem'"] {
              font-size: 0.8rem;
            }
            div[style*="fontSize: '1.1rem'"] {
              font-size: 0.9rem;
            }
             /* Điều chỉnh kích thước icon trên màn hình nhỏ */
            div[style*="position: 'absolute'"][style*="top: '20px'"] {
              top: 10px; // Giảm khoảng cách từ đỉnh
              left: 10px; // Giảm khoảng cách từ bên trái
              gap: 10px; // Giảm khoảng cách giữa các icon
            }
            i[class*="fa-"][style*="fontSize: '24px'"] {
              font-size: 20px !important; // Giảm kích thước icon
            }
          }
          /* Thêm media query cho màn hình lớn */
          @media (min-width: 1200px) {
            img[style*="width: '20vw'"] {
            width: 15vw; // Giảm kích thước logo trên màn hình lớn
          }
          div[style*="maxWidth: '35%']"] {
            maxWidth: 30%; // Giảm maxWidth của form trên màn hình lớn
          }
        div[style*="width: '15vw'"] {
            width: 12vw; // Giảm kích thước widget trên màn hình lớn
        }
      }
    `}
      </style>

      {/* Thêm nhiều đám mây, nốt nhạc, tai nghe, sóng âm thanh, hạt lấp lánh */}
      <div className="cloud1" style={{ top: "10%", left: "0" }}></div>
      <div
        className="cloud1"
        style={{ top: "40%", left: "-20%", animationDelay: "2s" }}
      ></div>

      <div className="cloud2" style={{ top: "25%", right: "0" }}></div>
      <div
        className="cloud2"
        style={{ top: "70%", right: "-10%", animationDelay: "1.5s" }}
      ></div>

      <div
        className="cloud3"
        style={{ top: "50%", left: "0", animationDelay: "3s" }}
      ></div>

      <div
        className="cloud3"
        style={{ top: "80%", left: "-15%", animationDelay: "0.5s" }}
      ></div>

      <div
        className="note"
        style={{ bottom: "0", left: "10%", animationDelay: "0s" }}
      >
        ♪
      </div>

      <div
        className="note"
        style={{ bottom: "0", left: "30%", animationDelay: "1s" }}
      >
        ♫
      </div>

      <div
        className="note"
        style={{ bottom: "0", left: "60%", animationDelay: "2s" }}
      >
        ♬
      </div>

      <div
        className="note"
        style={{ bottom: "0", left: "80%", animationDelay: "0.5s" }}
      >
        ♪
      </div>

      <div
        className="note"
        style={{ bottom: "0", left: "40%", animationDelay: "1.5s" }}
      >
        ♫
      </div>

      <div
        className="note"
        style={{ bottom: "0", left: "20%", animationDelay: "2.5s" }}
      >
        ♬
      </div>

      <div
        className="headphone"
        style={{ bottom: "0", left: "20%", animationDelay: "1.5s" }}
      >
        <i className="fas fa-headphones"></i>
      </div>

      <div
        className="headphone"
        style={{ bottom: "0", left: "50%", animationDelay: "2.5s" }}
      >
        <i className="fas fa-headphones"></i>
      </div>

      <div
        className="headphone"
        style={{ bottom: "0", left: "70%", animationDelay: "0.8s" }}
      >
        <i className="fas fa-headphones"></i>
      </div>

      <div
        className="headphone"
        style={{ bottom: "0", left: "35%", animationDelay: "1.2s" }}
      >
        <i className="fas fa-headphones"></i>
      </div>

      <div
        className="soundwave"
        style={{ bottom: "0", left: "40%", animationDelay: "1.2s" }}
      >
        <i
          className="fas fa-waveform"
          style={{ fontSize: "2rem", color: "#fff" }}
        ></i>
      </div>
      <div
        className="soundwave"
        style={{ bottom: "0", left: "65%", animationDelay: "2.2s" }}
      >
        <i
          className="fas fa-waveform"
          style={{ fontSize: "2rem", color: "#fff" }}
        ></i>
      </div>

      <div
        className="particle"
        style={{ left: "15%", animationDelay: "0s" }}
      ></div>

      <div
        className="particle"
        style={{ left: "35%", animationDelay: "1s" }}
      ></div>

      <div
        className="particle"
        style={{ left: "55%", animationDelay: "2s" }}
      ></div>

      <div
        className="particle"
        style={{ left: "75%", animationDelay: "3s" }}
      ></div>
    </div>
  );
};

export default SignUpPage;
