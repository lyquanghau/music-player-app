// components/HomePage.js
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

export default function HomePage() {
  const navigate = useNavigate();
  const { triggerPlaylistRefresh } = usePlaylist();

  /* ================= SEARCH ================= */
  // const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // const [searchLoading, setSearchLoading] = useState(false);

  /* ================= HERO ================= */
  const [recommendedTracks, setRecommendedTracks] = useState([]);

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

  /* ================= FETCH HOME RECOMMEND ================= */
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await api.get("/home");
        setRecommendedTracks(res.data || []);
      } catch {
        setRecommendedTracks([]);
      }
    };
    fetchHome();
  }, []);

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
      {/* HEADER (SEARCH INPUT) */}
      <Header
        onSearchResult={setSearchResults}
        onAddToPlaylist={handleOpenPlaylistModal}
      />

      {/* HERO */}
      <div style={{ paddingTop: 80 }}>
        <HeroDiscoverGrid
          tracks={recommendedTracks}
          searchResults={searchResults}
        />
      </div>

      {/* CONTENT */}
      <GenresSection />
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
