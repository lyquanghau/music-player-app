import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlaylist } from "../PlaylistContext";

import Header from "./layout/Header";
import HeroDiscoverGrid from "./hero/HeroDiscoverGrid";
import GenresSection from "./genres/GenresSection";
import TrendingSection from "./trending/TrendingSection";
import PlaylistsSection from "./playlists/PlaylistsSection";
import MVSection from "./mv/MVSection";
import ChannelsSection from "./channels/ChannelsSection";
import Footer from "./footer/Footer";

import api from "../api/api";
import "../assets/css/HomePage.css";

/* ================= GENRE → QUERY MAP ================= */
const GENRE_QUERY_MAP = {
  Pop: "pop music vietnam",
  Ballad: "vietnamese ballad song",
  "Rap Việt": "rap viet official mv",
  EDM: "edm music official",
  Acoustic: "acoustic music vietnam",
  Chill: "chill music playlist",
  Rock: "rock music official",
  "Nhạc Trẻ": "nhac tre moi nhat",
};

export default function HomePage() {
  const navigate = useNavigate();
  const { triggerPlaylistRefresh } = usePlaylist();

  /* ================= SEARCH ================= */
  const [searchResults, setSearchResults] = useState([]);

  /* ================= HERO ================= */
  const [homeTrending, setHomeTrending] = useState([]);
  const [genreTrending, setGenreTrending] = useState(null);
  const [activeGenre, setActiveGenre] = useState(null);

  /* ================= PLAYLIST ================= */
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [videoToAdd, setVideoToAdd] = useState(null);

  /* ================= FETCH PLAYLIST ================= */
  useEffect(() => {
    api
      .get("/custom-playlists")
      .then((res) => setPlaylists(res.data || []))
      .catch(() => {});
  }, []);

  /* ================= FETCH HOME TRENDING ================= */
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await api.get("/home");
        setHomeTrending(res.data || []);
      } catch {
        setHomeTrending([]);
      }
    };
    fetchHome();
  }, []);

  /* ================= GENRE CLICK ================= */
  const handleSelectGenre = async (genreTitle) => {
    const queries = GENRE_QUERY_MAP[genreTitle];
    if (!queries) return;

    // đảm bảo luôn là array
    const queryList = Array.isArray(queries) ? queries : [queries];

    try {
      let finalResults = [];

      for (const q of queryList) {
        const res = await api.get("/search", {
          params: { q },
        });

        const rawResults = res.data?.items || res.data?.results || [];

        // 🔍 lọc video chất lượng
        const filtered = rawResults.filter(
          (v) =>
            v &&
            v.id &&
            v.thumbnail &&
            v.duration &&
            !v.title?.toLowerCase().includes("shorts")
        );

        if (filtered.length >= 6) {
          finalResults = filtered;
          break; // ✅ đủ đẹp → dừng luôn
        }

        // fallback nếu chưa có kết quả nào tốt
        if (finalResults.length === 0 && filtered.length > 0) {
          finalResults = filtered;
        }
      }

      setGenreTrending(finalResults.slice(0, 8));
      setActiveGenre(genreTitle);

      // reset search UI (khôi phục ô tìm kiếm)
      setSearchResults([]);

      scrollToHero();
    } catch (err) {
      console.error("Genre trending error:", err);
    }
  };

  /* ================= RESET HERO ================= */
  const resetHeroTrending = () => {
    setGenreTrending(null);
    setActiveGenre(null);
    scrollToHero();
  };

  const scrollToHero = () => {
    const hero = document.getElementById("hero");
    if (hero) {
      hero.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* ================= PLAYLIST MODAL ================= */
  const handleOpenPlaylistModal = (videoId) => {
    setVideoToAdd(videoId);
    setShowPlaylistModal(true);
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await api.post(`/custom-playlists/${playlistId}/add-video`, {
        videoId: videoToAdd,
      });
      triggerPlaylistRefresh();
      setShowPlaylistModal(false);
    } catch {}
  };

  return (
    <div className="home-page">
      {/* HEADER */}
      <Header
        onSearchResult={setSearchResults}
        onAddToPlaylist={handleOpenPlaylistModal}
      />

      {/* HERO */}
      <div id="hero" style={{ paddingTop: 80 }}>
        <HeroDiscoverGrid
          tracks={genreTrending || homeTrending}
          searchResults={searchResults}
          activeGenre={activeGenre}
          onResetGenre={resetHeroTrending}
        />
      </div>

      {/* CONTENT */}
      <GenresSection onSelectGenre={handleSelectGenre} />
      <TrendingSection />
      <PlaylistsSection
        playlists={playlists}
        onOpen={(id) => navigate(`/playlist/${id}`)}
        onPlay={(id) => navigate(`/playlist/${id}?autoplay=true`)}
      />
      <MVSection />
      <ChannelsSection onOpen={(id) => navigate(`/channel/${id}`)} />
      <Footer />

      {/* PLAYLIST MODAL */}
      {showPlaylistModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Chọn playlist</h3>
            <ul>
              {playlists.map((p) => (
                <li key={p._id} onClick={() => handleAddToPlaylist(p._id)}>
                  {p.name} ({p.videos.length})
                </li>
              ))}
            </ul>
            <button onClick={() => setShowPlaylistModal(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}
