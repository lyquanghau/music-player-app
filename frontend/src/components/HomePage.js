import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlaylist } from "../PlaylistContext";

import Header from "./layout/Header";
import HeroSection from "./hero/HeroSection";
import GenresSection from "./genres/GenresSection";
import TrendingSection from "./trending/TrendingSection";

import api from "../api/api";
import "../assets/css/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { triggerPlaylistRefresh } = usePlaylist();

  /* ================= LOGIC STATE (GIỮ NGUYÊN) ================= */
  const [videoList, setVideoList] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [videoToAdd, setVideoToAdd] = useState(null);
  const [notification, setNotification] = useState(null);
  const [musicNotes, setMusicNotes] = useState([]);

  /* ================= FETCH PLAYLIST (GIỮ LOGIC) ================= */
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await api.get("/custom-playlists");
        setPlaylists(res.data);
      } catch {
        setNotification({
          message: "Không thể lấy playlist",
          type: "error",
        });
      }
    };
    fetchPlaylists();
  }, []);

  /* ================= MUSIC NOTES (GIỮ LOGIC – KHÔNG RENDER) ================= */
  useEffect(() => {
    const notes = [];
    const rows = 8;
    const cols = 16;
    const types = ["♪", "♫"];

    for (let i = 0; i < rows * cols; i++) {
      notes.push({
        id: i,
        x: ((i % cols) + 0.5) * (100 / cols),
        y: (Math.floor(i / cols) + 0.5) * (100 / rows),
        type: types[Math.floor(Math.random() * types.length)],
      });
    }
    setMusicNotes(notes);
  }, []);

  /* ================= LOGIC HANDLERS (GIỮ NGUYÊN) ================= */
  const handleSelectVideo = (videoId) => {
    navigate(`/play/${videoId}`);
  };

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
      setNotification({
        message: "Đã thêm video!",
        type: "success",
      });
    } catch {
      setNotification({
        message: "Thêm video thất bại",
        type: "error",
      });
    }
  };

  /* ================= RENDER (CHỈ HEADER + HERO) ================= */
  return (
    <div className="home-page">
      {/* ================= HEADER ================= */}
      <Header
        onSearchResult={setVideoList}
        onSelectVideo={handleSelectVideo}
        onAddToPlaylist={handleOpenPlaylistModal}
      />

      {/* ================= HERO ================= */}
      <HeroSection onStart={() => navigate("/trending")} />

      {/* ================= GENRES ================= */}
      <HeroSection onStart={() => navigate("/trending")} />
      <GenresSection />

      {/* ================= TRENDING ================= */}
      <TrendingSection onPlay={(id) => navigate(`/play/${id}`)} />
    </div>
  );
};

export default HomePage;
