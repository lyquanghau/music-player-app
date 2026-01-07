// src/components/HomePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Search from "./Search";
import CustomPlaylists from "./CustomPlaylists";
import { usePlaylist } from "../PlaylistContext";
import { IoArrowForward } from "react-icons/io5";
import Cloud3D from "./particles/Cloud3D";
import "../assets/css/HomePage.css";
import api from "../api/api";
import SearchResults from "./SearchResults";

import logo from "../assets/logo.png";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8404";

const HomePage = () => {
  const { triggerPlaylistRefresh } = usePlaylist();
  const navigate = useNavigate();

  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [videoToAdd, setVideoToAdd] = useState(null);
  const [notification, setNotification] = useState(null);
  const [musicNotes, setMusicNotes] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await api.get("/custom-playlists");
        setPlaylists(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách playlist:", error);
        setNotification({
          message: "Không thể lấy danh sách playlist!",
          type: "error",
        });
        setTimeout(() => setNotification(null), 3000);
      }
    };
    fetchPlaylists();
  }, []);

  // Tạo nốt nhạc đồng đều
  useEffect(() => {
    const generateMusicNotes = () => {
      const notes = [];
      const noteTypes = ["♪", "♫"]; // Các loại nốt nhạc
      const rows = 8; // Số hàng
      const cols = 16; // Số cột
      const totalNotes = rows * cols; // Tổng số nốt nhạc

      for (let i = 0; i < totalNotes; i++) {
        const row = Math.floor(i / cols); // Hàng
        const col = i % cols; // Cột

        // Tính vị trí trung tâm của ô lưới
        const x = (col + 0.5) * (100 / cols); // Vị trí x (trung tâm ô)
        const y = (row + 0.5) * (100 / rows); // Vị trí y (trung tâm ô)

        // Thêm một chút ngẫu nhiên trong ô (trong khoảng ±10% kích thước ô)
        const offsetX = (Math.random() - 0.5) * (100 / cols) * 0.6; // ±30% chiều rộng ô
        const offsetY = (Math.random() - 0.5) * (100 / rows) * 0.6; // ±30% chiều cao ô

        const note = {
          id: i,
          x: x + offsetX, // Vị trí x cuối cùng
          y: y + offsetY, // Vị trí y cuối cùng
          type: noteTypes[Math.floor(Math.random() * noteTypes.length)], // Chọn ngẫu nhiên loại nốt nhạc
        };
        notes.push(note);
      }
      setMusicNotes(notes);
    };

    generateMusicNotes();
  }, []);

  // Hiệu ứng di chuột
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 100;
      const mouseY = (e.clientY / window.innerHeight) * 100;

      const notes = document.querySelectorAll(".music-note");
      notes.forEach((note) => {
        const rect = note.getBoundingClientRect();
        const noteX = (rect.left / window.innerWidth) * 100;
        const noteY = (rect.top / window.innerHeight) * 100;

        const distance = Math.sqrt(
          Math.pow(mouseX - noteX, 2) + Math.pow(mouseY - noteY, 2)
        );

        if (distance < 5) {
          note.classList.add("glow");
        } else {
          note.classList.remove("glow");
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleSelectVideo = async (videoId, index) => {
    navigate(`/play/${videoId}`);
    if (index >= 0 && index < videoList.length) {
      setSelectedVideoId(videoId);
    } else {
      try {
        const response = await axios.get(`${API_URL}/api/video/${videoId}`);
        const videoInfo = response.data;
        setSelectedVideoId(videoId);
        setVideoList([videoInfo]);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin video:", error);
        setNotification({
          message: "Không thể tải thông tin video!",
          type: "error",
        });
        setTimeout(() => setNotification(null), 3000);
      }
    }
  };

  const playFromPlaylist = (videoId, index, playlistVideos) => {
    if (!videoId || !playlistVideos || !Array.isArray(playlistVideos)) return;
    const validVideos = playlistVideos.filter(
      (video) =>
        video.id &&
        video.title &&
        video.channel &&
        typeof video.thumbnail === "string"
    );
    if (validVideos.length === 0) {
      setSelectedVideoId(null);
      setVideoList([]);
      return;
    }
    setSelectedVideoId(videoId);
    setVideoList(validVideos);
    navigate(`/play/${videoId}`);
  };

  const handleOpenPlaylistModal = (videoId) => {
    setVideoToAdd(videoId);
    setShowPlaylistModal(true);
  };

  const handleAddToPlaylist = async (playlistId) => {
    if (!videoToAdd) return;
    try {
      await api.post(`/custom-playlists/${playlistId}/add-video`, {
        videoId: videoToAdd,
      });
      triggerPlaylistRefresh();
      setShowPlaylistModal(false);
      setVideoToAdd(null);
      setNotification({
        message: "Đã thêm video vào playlist thành công!",
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Lỗi khi thêm video vào playlist:", error);
      setNotification({
        message: "Có lỗi xảy ra khi thêm video!",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="home-page">
  {musicNotes.map((note) => (
    <div
      key={note.id}
      className="music-note"
      style={{
        left: `${note.x}%`,
        top: `${note.y}%`,
      }}
    >
      {note.type}
    </div>
  ))}

      <header id="Header">
        <div className="header-top">
          <div className="logo">
            <a href="/home">
              <img src={logo} alt="Sky Music" />
            </a>
          </div>

          <nav className="nav-main">
            <a href="/genres">Thể loại</a>
            <a href="/trending">Thịnh hành</a>
            <a href="/playlists">Danh sách phát</a>
            <a href="/music-videos">Video âm nhạc</a>
            <a href="/channels">Kênh</a>
          </nav>

          <div className="search-bar">
            <Search
              setVideoList={setVideoList}
              onSelectVideo={handleSelectVideo}
              onAddToPlaylist={handleOpenPlaylistModal}
            />
          </div>

          <div className="auth-buttons">
            <button
              onClick={handleLogout}
              className="logout-btn"
              title="Đăng xuất"
            >
              <IoArrowForward />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <div id="Content" className="main-content">
        {/* ===== LEFT COLUMN ===== */}
        <div className="left-column">
  {videoList.length > 0 ? (
    <SearchResults
      videoList={videoList}
      onSelectVideo={handleSelectVideo}
      onAddToPlaylist={handleOpenPlaylistModal}
    />
  ) : (
    <div id="Slider" className="hero-section">
      <div className="hero-content">
        <div className="slider-container">
          <div className="slider-wrapper">
            <div className="slider-list">
              {sliderImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`slider ${index + 1}`}
                  className={`slider-list-img ${
                    sliderIndex === index ? "active" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="arrow">
            <div className="arrow-left" onClick={handlePrevSlide}>
              &lt;
            </div>
            <div className="arrow-right" onClick={handleNextSlide}>
              &gt;
            </div>
          </div>

          <div className="navigation-dots">
            {sliderImages.map((_, index) => (
              <span
                key={index}
                className={`dot dot-${index} ${
                  sliderIndex === index ? "active" : ""
                }`}
                onClick={() => setSliderIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )}
</div>

          <div className="hero-text">
            <h1>Khám phá âm nhạc của bạn</h1>
            <p>Tìm kiếm và tạo danh sách phát yêu thích của bạn</p>
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="right-column">
          <Cloud3D id="cloud-container" />
        </div>
      </div>

      {/* ================= MODAL ADD PLAYLIST ================= */}
      {showPlaylistModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Chọn playlist để thêm</h3>

            {playlists.length === 0 ? (
              <p>Chưa có playlist nào</p>
            ) : (
              <ul>
                {playlists.map((playlist) => (
                  <li
                    key={playlist._id}
                    onClick={() => handleAddToPlaylist(playlist._id)}
                  >
                    {playlist.name} ({playlist.videos.length} video)
                  </li>
                ))}
              </ul>
            )}

            <button onClick={() => setShowPlaylistModal(false)}>Đóng</button>
          </div>
        </div>
      )}

      {/* ================= NOTIFICATION ================= */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default HomePage;
