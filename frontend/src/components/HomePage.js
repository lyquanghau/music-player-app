import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlaylist } from "../PlaylistContext";
import { usePlayer } from "../context/PlayerContext";

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

  /* ================= CONTEXT ================= */
  const { refreshTrigger, triggerPlaylistRefresh } = usePlaylist();
  const { playTrack, playPlaylist, currentTrack } = usePlayer();

  /* ================= SEARCH ================= */
  const [searchResults, setSearchResults] = useState([]);

  /* ================= HERO ================= */
  const [homeTrending, setHomeTrending] = useState([]);
  const [genreTrending, setGenreTrending] = useState(null);
  const [activeGenre, setActiveGenre] = useState(null);

  /* ================= PLAYLIST ================= */
  const [playlists, setPlaylists] = useState([]);

  // add-to-playlist modal
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [videoToAdd, setVideoToAdd] = useState(null);

  // popup xem playlist
  const [activePlaylist, setActivePlaylist] = useState(null);

  // cache track info (title thật)
  const [trackCache, setTrackCache] = useState({});

  /* ================= FETCH PLAYLIST ================= */
  useEffect(() => {
    api
      .get("/custom-playlists")
      .then((res) => setPlaylists(res.data || []))
      .catch(() => {});
  }, [refreshTrigger]);

  /* ================= FETCH HOME TRENDING ================= */
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await api.get("/trending", {
          params: { page: 1, limit: 8 },
        });

        const normalized = (res.data?.items || []).map((item) => ({
          ...item,
          id: item.videoId,
        }));

        setHomeTrending(normalized);
      } catch {
        setHomeTrending([]);
      }
    };

    fetchHome();
  }, []);

  useEffect(() => {
    if (!homeTrending.length) return;

    setTrackCache((prev) => {
      const next = { ...prev };
      homeTrending.forEach((t) => {
        if (t?.id && !next[t.id]) {
          next[t.id] = t;
        }
      });
      return next;
    });
  }, [homeTrending]);

  useEffect(() => {
    if (!genreTrending?.length) return;

    setTrackCache((prev) => {
      const next = { ...prev };
      genreTrending.forEach((t) => {
        if (t?.id && !next[t.id]) {
          next[t.id] = t;
        }
      });
      return next;
    });
  }, [genreTrending]);

  // 🔥 Cache track từ kết quả tìm kiếm
  useEffect(() => {
    if (!searchResults.length) return;

    setTrackCache((prev) => {
      const next = { ...prev };
      searchResults.forEach((t) => {
        if (t?.id && !next[t.id]) {
          next[t.id] = t;
        }
      });
      return next;
    });
  }, [searchResults]);

  /* ================= GENRE ================= */
  const handleSelectGenre = async (genreTitle) => {
    const q = GENRE_QUERY_MAP[genreTitle];
    if (!q) return;

    try {
      const res = await api.get("/search", { params: { q } });
      const items = res.data?.items || [];
      setGenreTrending(items.slice(0, 8));
      setActiveGenre(genreTitle);
      setSearchResults([]);
      scrollToHero();
    } catch {}
  };

  const resetHeroTrending = () => {
    setGenreTrending(null);
    setActiveGenre(null);
    scrollToHero();
  };

  const scrollToHero = () => {
    document.getElementById("hero")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* ================= ADD TO PLAYLIST ================= */
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

  /* ================= PLAY ================= */

  // ▶ Play single track (Hero / Search / Trending)
  const handlePlaySingle = (track, tracks = []) => {
    // cache track hiện tại
    setTrackCache((prev) => ({
      ...prev,
      [track.id]: track,
    }));

    // cache danh sách nếu có
    tracks.forEach((t) => {
      if (t?.id) {
        setTrackCache((prev) => ({
          ...prev,
          [t.id]: t,
        }));
      }
    });

    playTrack(track, tracks);
  };

  // build playlist tracks từ cache
  const buildPlaylistTracks = (playlist) => {
    return playlist.videos.map((id, index) => {
      const cached = trackCache[id];
      return (
        cached || {
          id,
          title: `Track ${index + 1}`,
          channel: "YouTube",
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        }
      );
    });
  };

  // ▶ Play toàn bộ playlist
  const handlePlayPlaylist = (playlist) => {
    if (!playlist?.videos?.length) return;
    const tracks = buildPlaylistTracks(playlist);
    playPlaylist(tracks, 0);
  };

  /* ================= RENDER ================= */
  return (
    <div className="home-page">
      <Header
        onSearchResult={setSearchResults}
        onAddToPlaylist={handleOpenPlaylistModal}
      />

      <div id="hero" style={{ paddingTop: 80 }}>
        <HeroDiscoverGrid
          tracks={genreTrending || homeTrending}
          searchResults={searchResults}
          activeGenre={activeGenre}
          onResetGenre={resetHeroTrending}
          onPlayTrack={handlePlaySingle}
        />
      </div>

      <GenresSection onSelectGenre={handleSelectGenre} />
      <TrendingSection />

      <PlaylistsSection
        playlists={playlists}
        onOpen={(playlist) => setActivePlaylist(playlist)}
        onPlay={(playlist) => {
          setActivePlaylist(playlist);
          handlePlayPlaylist(playlist);
        }}
      />

      <MVSection />
      <ChannelsSection onOpen={(id) => navigate(`/channel/${id}`)} />
      <Footer />

      {/* ADD TO PLAYLIST MODAL */}
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

      {/* PLAYLIST POPUP */}
      {activePlaylist && (
        <div className="playlist-popup-overlay">
          <div className="playlist-popup">
            <h3>{activePlaylist.name}</h3>

            <div className="playlist-popup-actions">
              <button
                className="popup-btn primary"
                onClick={() => handlePlayPlaylist(activePlaylist)}
              >
                ▶ Phát tất cả
              </button>

              <button
                className="popup-btn ghost"
                onClick={() => setActivePlaylist(null)}
              >
                ✕ Đóng
              </button>
            </div>

            <ul className="playlist-popup-list">
              {activePlaylist.videos.map((id, index) => {
                const track = trackCache[id] || {
                  id,
                  title: `Track ${index + 1}`,
                  channel: "YouTube",
                  thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                };

                const isActive = currentTrack?.id === id;

                return (
                  <li
                    key={id}
                    className={`playlist-popup-item ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() => {
                      const tracks = buildPlaylistTracks(activePlaylist);
                      playTrack(track, tracks);
                    }}
                  >
                    <img src={track.thumbnail} alt={track.title} />
                    <div className="popup-track-meta">
                      <div className="popup-track-title">{track.title}</div>
                      <div className="popup-track-channel">{track.channel}</div>
                    </div>
                    {isActive && <span className="playing-dot">●</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
