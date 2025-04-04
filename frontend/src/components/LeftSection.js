import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";

const LeftSection = () => {
  const [listenCount, setListenCount] = useState(0);
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);

  useEffect(() => {
    const targetCount = 1000000;
    const duration = 2000;
    const increment = targetCount / (duration / 50);
    let currentCount = 0;

    const counter = setInterval(() => {
      currentCount += increment;
      if (currentCount >= targetCount) {
        currentCount = targetCount;
        clearInterval(counter);
      }
      setListenCount(Math.floor(currentCount));
    }, 50);

    return () => clearInterval(counter);
  }, []);

  return (
    <div
      style={{
        flex: 1,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        <img
          src={logo}
          alt="Sky Music Logo"
          className="logo"
          style={{
            width: "20vw",
            maxWidth: "350px",
            marginBottom: "10px",
            animation: "scalePulse 2s infinite ease-in-out",
          }}
          onLoad={() => setIsLogoLoaded(true)}
        />
        {isLogoLoaded && (
          <div className="soundwave-effect" style={{ opacity: 1 }}></div>
        )}
      </div>
      <p
        style={{
          color: "#fff",
          fontSize: "0.9rem",
          fontWeight: "500",
          fontStyle: "italic",
          textAlign: "center",
          margin: "5px 0 15px 0",
          textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
          opacity: 0.9,
          maxWidth: "80%",
        }}
      >
        Bắt sóng bầu trời☁️, thả vibe cực chất🎶
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            padding: "8px",
            width: "15vw",
            maxWidth: "180px",
            minWidth: "150px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "transform 0.3s, background 0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
        >
          <i
            className="fas fa-trophy"
            style={{ fontSize: "1.2rem", color: "#FFD700" }}
          ></i>
          <div>
            <p style={{ fontSize: "0.8rem", margin: 0, fontWeight: "bold" }}>
              Top trang web 2025
            </p>
            <p style={{ fontSize: "0.7rem", margin: 0, opacity: 0.8 }}>
              Bình chọn toàn cầu
            </p>
          </div>
        </div>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            padding: "8px",
            width: "15vw",
            maxWidth: "180px",
            minWidth: "150px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "transform 0.3s, background 0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
        >
          <i
            className="fas fa-headphones"
            style={{ fontSize: "1.2rem", color: "#1e90ff" }}
          ></i>
          <div>
            <p style={{ fontSize: "0.8rem", margin: 0, fontWeight: "bold" }}>
              {listenCount.toLocaleString()} lượt nghe
            </p>
            <p style={{ fontSize: "0.7rem", margin: 0, opacity: 0.8 }}>
              Trong tháng qua
            </p>
          </div>
        </div>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            padding: "8px",
            width: "15vw",
            maxWidth: "180px",
            minWidth: "150px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "transform 0.3s, background 0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
        >
          <i
            className="fas fa-list"
            style={{ fontSize: "1.2rem", color: "#ff69b4" }}
          ></i>
          <div>
            <p style={{ fontSize: "0.8rem", margin: 0, fontWeight: "bold" }}>
              100.000+ playlist
            </p>
            <p style={{ fontSize: "0.7rem", margin: 0, opacity: 0.8 }}>
              Năm 2025
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: "15px",
          textAlign: "center",
          color: "#fff",
          fontSize: "1rem",
          fontWeight: "500",
          maxWidth: "70%",
          lineHeight: "1.5",
          textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
        }}
      >
        Khám phá âm nhạc không giới hạn cùng Sky Music - nơi bạn bắt nhịp bầu
        trời và thả hồn vào từng giai điệu!
      </div>
      <button
        style={{
          marginTop: "15px",
          marginBottom: "15px",
          padding: "8px 25px",
          borderRadius: "5px",
          border: "none",
          background: "#1e90ff",
          color: "#fff",
          fontSize: "0.9rem",
          cursor: "pointer",
          transition: "background 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.background = "#4682b4")}
        onMouseOut={(e) => (e.target.style.background = "#1e90ff")}
        onClick={() => (window.location.href = "/explore")}
      >
        Khám phá ngay
      </button>

      {/* Thêm CSS cho hiệu ứng sóng âm và scalePulse */}
      <style>
        {`
          .soundwave-effect {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            opacity: 1;
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
        `}
      </style>
    </div>
  );
};

export default LeftSection;
