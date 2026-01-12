import { Cloud, Facebook, Twitter, Instagram, Send, Heart } from "lucide-react";
import { SiSpotify } from "react-icons/si";
import "./Footer.css";

const quickLinks = [
  { name: "Trang chủ", href: "#hero" },
  { name: "Thể loại", href: "#genres" },
  { name: "Xu hướng", href: "#trending" },
  { name: "Danh sách phát", href: "#playlists" },
  { name: "MV", href: "#mv" },
  { name: "Kênh", href: "#channels" },
];

const supportLinks = [
  { name: "Trung tâm trợ giúp", href: "#" },
  { name: "Liên hệ", href: "#" },
  { name: "Chính sách riêng tư", href: "#" },
  { name: "Điều khoản sử dụng", href: "#" },
  { name: "Chính sách cookie", href: "#" },
];

export default function Footer() {
  const scrollToSection = (href) => {
    if (!href.startsWith("#")) return;

    const el = document.getElementById(href.replace("#", ""));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ===== GRID ===== */}
        <div className="footer-grid">
          {/* ===== BRAND ===== */}
          <div className="footer-brand">
            <div className="brand-header">
              <div className="brand-logo">
                <Cloud size={22} />
              </div>
              <span className="brand-name">Sky Music</span>
            </div>

            <p className="brand-desc">
              Nghe nhạc chất lượng cao, khám phá những giai điệu mới mỗi ngày
              cùng Sky Music.
            </p>

            <div className="socials">
              <button aria-label="Facebook">
                <Facebook size={18} />
              </button>
              <button aria-label="Twitter">
                <Twitter size={18} />
              </button>
              <button aria-label="Instagram">
                <Instagram size={18} />
              </button>
              <button aria-label="Spotify">
                <SiSpotify size={18} />
              </button>
            </div>
          </div>

          {/* ===== QUICK LINKS ===== */}
          <div className="footer-col">
            <h4>Liên kết nhanh</h4>
            <ul>
              {quickLinks.map((l) => (
                <li key={l.name}>
                  <button onClick={() => scrollToSection(l.href)}>
                    {l.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== SUPPORT ===== */}
          <div className="footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              {supportLinks.map((l) => (
                <li key={l.name}>
                  <a href={l.href}>{l.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== NEWSLETTER ===== */}
          <div className="footer-col">
            <h4>Cập nhật mới</h4>
            <p className="newsletter-desc">
              Nhận tin tức âm nhạc và cập nhật mới nhất
            </p>

            <div className="newsletter">
              <input type="email" placeholder="Email của bạn" />
              <button aria-label="Gửi">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM ===== */}
        <div className="footer-bottom">
          <p>
            © 2024 Sky Music. Bản quyền thuộc về Sky Music.
            <span>
              {" "}
              Tạo ra với <Heart size={14} /> cho người yêu âm nhạc
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
