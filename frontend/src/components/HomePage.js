// src/components/HomePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Search from "./Search";
import CustomPlaylists from "./CustomPlaylists";
import Recommendations from "./Recommendations";
import { usePlaylist } from "../PlaylistContext";
// import LogoutButton from "./LogoutButton";
import "../assets/css/HomePage.css";

import Slider1 from "../assets/Sliders/Sliders_1.png";
import Slider2 from "../assets/Sliders/Sliders_2.png";
import Slider3 from "../assets/Sliders/Sliders_3.png";
import Slider4 from "../assets/Sliders/Sliders_4.png";
import Slider5 from "../assets/Sliders/Sliders_5.png";
import Slider6 from "../assets/Sliders/Sliders_6.png";
import Slider7 from "../assets/Sliders/Sliders_7.png";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8404";

const HomePage = () => {
  const { triggerPlaylistRefresh } = usePlaylist();
  const navigate = useNavigate();

  const [sliderIndex, setSliderIndex] = useState(0);
  const sliderImages = [
    Slider1,
    Slider2,
    Slider3,
    Slider4,
    Slider5,
    Slider6,
    Slider7,
  ];
  const sliderLength = sliderImages.length;

  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [videoToAdd, setVideoToAdd] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setSliderIndex((prev) => (prev === sliderLength - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(sliderInterval);
  }, [sliderLength]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/custom-playlists`);
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

  const handleNextSlide = () => {
    setSliderIndex((prev) => (prev === sliderLength - 1 ? 0 : prev + 1));
  };

  const handlePrevSlide = () => {
    setSliderIndex((prev) => (prev === 0 ? sliderLength - 1 : prev - 1));
  };

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
      await axios.post(
        `${API_URL}/api/custom-playlists/${playlistId}/add-video`,
        {
          videoId: videoToAdd,
        }
      );
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

  return (
    <div className="home-page">
      <header id="Header">
        <div className="header-top">
          <div className="logo">
            <a href="/home">
              <span className="logo-icon">🎵</span>{" "}
              {/* Thay thế bằng biểu tượng âm nhạc đơn giản */}
              <span className="logo-text">Sky Music</span>
            </a>
          </div>
          <div className="search-bar">
            <Search
              onSelectVideo={handleSelectVideo}
              setVideoList={setVideoList}
              onAddToPlaylist={handleOpenPlaylistModal}
            />
          </div>
          <div className="auth-buttons">
            <button className="login-btn" onClick={() => navigate("/login")}>
              Đăng nhập
            </button>
            <button
              className="signup-btn"
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </button>
          </div>
        </div>
        <div className="header-menu">
          <nav className="nav-main">
            <a href="/music_theme">Chủ đề</a>
            <a href="/top_song">BXH</a>
            <a href="/album">Album</a>
            <a href="/music_video">Music Video</a>
            <a href="/artist">Nghệ sĩ</a>
            <a href="/vip" className="vip-link">
              <span className="crown-icon">👑</span> VIP
            </a>
          </nav>
        </div>
      </header>

      <div id="Slider">
        <div className="slider-container">
          <div className="slider-wrapper">
            <div
              className="slider-list"
              style={{ transform: `translateX(${-500 * sliderIndex}px)` }}
            >
              {sliderImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className="slider-list-img"
                  alt={`slider ${index + 1}`}
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

      <div id="Content" className="main-content">
        <div className="left-column">
          <Recommendations
            currentVideoId={selectedVideoId}
            onSelectVideo={handleSelectVideo}
          />
        </div>
        <div className="right-column">
          <CustomPlaylists
            onSelectVideo={handleSelectVideo}
            playFromPlaylist={playFromPlaylist}
            onAddToPlaylist={handleAddToPlaylist}
          />
        </div>
      </div>

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

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default HomePage;
