import { useState, useEffect } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchComponent from "../Search";
import logo from "../../assets/logo.png";
import "../../assets/css/Header.css";

/* ================= MENU CONFIG ================= */
const MENU_ITEMS = [
  { id: "hero", label: "Trang chủ" },
  { id: "genres", label: "Thể loại" },
  { id: "trending", label: "Xu hướng" },
  { id: "playlists", label: "Danh sách phát" },
  { id: "mv", label: "MV" },
  { id: "channels", label: "Kênh" },
];

export default function Header({
  onSearchResult, // ✅ dùng cho search
  onSelectVideo, // ✅ GIỮ NGUYÊN
  onAddToPlaylist, // ✅ GIỮ NGUYÊN
}) {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  /* ================= HEADER SCROLL EFFECT ================= */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= SCROLL SPY ================= */
  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollPos = window.scrollY + 120;
      for (let i = MENU_ITEMS.length - 1; i >= 0; i--) {
        const section = document.getElementById(MENU_ITEMS[i].id);
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(MENU_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScrollSpy);
    handleScrollSpy();
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  /* ================= SCROLL TO SECTION ================= */
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMobileMenuOpen(false);
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header
      className={`header glass-effect ${
        isScrolled ? "header-scrolled" : "header-top"
      }`}
    >
      <nav className="header-nav">
        {/* LOGO */}
        <div
          className="header-logo"
          onClick={() => scrollTo("hero")}
          title="Trang chủ"
        >
          <img src={logo} alt="Sky Music" className="header-logo-img" />
        </div>

        {/* DESKTOP MENU */}
        <div className="header-menu">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={activeSection === item.id ? "active" : ""}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="header-actions">
          <SearchComponent
            variant="header"
            setVideoList={onSearchResult}
            onSelectVideo={onSelectVideo}
            onAddToPlaylist={onAddToPlaylist}
          />

          <button
            className="header-logout"
            onClick={handleLogout}
            title="Đăng xuất"
          >
            <LogOut size={16} />
          </button>

          <button
            className="header-mobile-toggle"
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            aria-label="Mở menu"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="header-mobile-menu">
          <SearchComponent
            setVideoList={onSearchResult}
            onSelectVideo={onSelectVideo}
            onAddToPlaylist={onAddToPlaylist}
          />

          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={activeSection === item.id ? "active" : ""}
            >
              {item.label}
            </button>
          ))}

          <button className="header-mobile-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </header>
  );
}
