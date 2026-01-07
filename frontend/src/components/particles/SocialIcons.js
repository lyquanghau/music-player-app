import React, { useState, useEffect } from "react";

const SocialIcons = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Trạng thái menu
  const [showMessage, setShowMessage] = useState(true); // Trạng thái hiển thị tin nhắn

  // Dữ liệu icon mạng xã hội
  const socialIcons = [
    {
      href: "https://your-personal-website.com",
      icon: "fas fa-globe",
      color: "#fff",
      angle: 0,
    },
    {
      href: "https://www.facebook.com/quang.hau.749246/?locale=vi_VN",
      icon: "fab fa-facebook",
      color: "#4267B2",
      angle: 35,
    },
    {
      href: "https://www.instagram.com/lyqhau_8th4/",
      icon: "fab fa-instagram",
      color: "#E95950",
      angle: 65,
    },
    {
      href: "https://github.com/lyquanghau",
      icon: "fab fa-github",
      color: "#171515",
      angle: 95,
    },
  ];

  // Tự động ẩn tin nhắn sau 10 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 30000); // 10 giây
    return () => clearTimeout(timer); // Dọn dẹp khi component bị unmount
  }, []);

  // Xử lý khi nhấp vào icon chính
  const handleClick = () => {
    setIsMenuOpen((prev) => !prev); // Đảo ngược trạng thái menu (mở/đóng)
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 10,
      }}
    >
      {/* Icon chính và menu radial */}
      <div
        style={{
          cursor: "pointer",
          color: "#fff",
          opacity: 0.9,
          transition: "opacity 0.3s",
          zIndex: 100,
          position: "relative",
          pointerEvents: "auto",
          width: "24px",
          height: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={handleClick} // Nhấp để mở/đóng menu
        title="Social Links"
      >
        <i className="fas fa-info-circle" style={{ fontSize: "20px" }}></i>
      </div>

      {/* Các icon mạng xã hội trong menu radial */}
      {socialIcons.map((item, index) => (
        <a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            color: item.color,
            opacity: isMenuOpen ? 0.8 : 0,
            transform: isMenuOpen
              ? `translate(${Math.cos((item.angle * Math.PI) / 180) * 40}px, ${
                  Math.sin((item.angle * Math.PI) / 180) * 40
                }px)`
              : "translate(0, 0)",
            transition:
              "transform 0.2s ease, opacity 0.1s ease, box-shadow 0.1s ease",
            transitionDelay: `${index * 0.05}s`,
            zIndex: isMenuOpen ? 5 : 0,
            borderRadius: "50%",
            pointerEvents: isMenuOpen ? "auto" : "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.boxShadow = `0 0 10px ${item.color}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.8";
            e.currentTarget.style.boxShadow = "none";
          }}
          title={`Visit my ${item.icon.split("fa-")[1]}`}
        >
          <i className={item.icon} style={{ fontSize: "18px" }}></i>
        </a>
      ))}

      {/* Dòng tin nhắn "Thông tin về chúng tôi" */}
      {showMessage && (
        <div
          style={{
            position: "absolute",
            top: "24px",
            left: "0",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            padding: "4px 8px",
            color: "#fff",
            fontSize: "0.6rem",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            opacity: showMessage ? 1 : 0,
            transform: showMessage ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            whiteSpace: "nowrap", // Đảm bảo nằm ngang
          }}
        >
          Thông tin về chúng tôi
        </div>
      )}
    </div>
  );
};

export default SocialIcons;
