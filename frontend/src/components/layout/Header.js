import { useState, useEffect } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchComponent from "../Search";
import logo from "../../assets/logo.png";
import "../../assets/css/Header.css";

export default function Header({
  onSearchResult,
  onSelectVideo,
  onAddToPlaylist,
}) {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* ================= SCROLL DETECT ================= */
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= SCROLL TO SECTION ================= */
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
  };

  /* ================= ACTIONS ================= */
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
          <button onClick={() => scrollTo("genres")}>Thể loại</button>
          <button onClick={() => scrollTo("trending")}>Xu hướng</button>
          <button onClick={() => scrollTo("playlists")}>Danh sách phát</button>
          <button onClick={() => scrollTo("mv")}>MV</button>
          <button onClick={() => scrollTo("channels")}>Kênh</button>
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

      {/* ================= MOBILE MENU ================= */}
      {isMobileMenuOpen && (
        <div className="header-mobile-menu">
          <SearchComponent
            setVideoList={onSearchResult}
            onSelectVideo={onSelectVideo}
            onAddToPlaylist={onAddToPlaylist}
          />

          <button onClick={() => scrollTo("genres")}>Thể loại</button>
          <button onClick={() => scrollTo("trending")}>Xu hướng</button>
          <button onClick={() => scrollTo("playlists")}>Danh sách phát</button>
          <button onClick={() => scrollTo("mv")}>MV</button>
          <button onClick={() => scrollTo("channels")}>Kênh</button>

          <button className="header-mobile-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </header>
  );
}
