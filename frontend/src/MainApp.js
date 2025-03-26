import React, { useState, useEffect } from "react";
import axios from "axios";
import Search from "./components/Search";
import Player from "./components/Player";
import CustomPlaylists from "./components/CustomPlaylists";
import Recommendations from "./components/Recommendations";
import { usePlaylist } from "./PlaylistContext"; // Import context
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8404";

const MainApp = () => {
  const { triggerPlaylistRefresh } = usePlaylist(); // Sử dụng context
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentVideoInfo, setCurrentVideoInfo] = useState(null);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [playlists, setPlaylists] = useState([]); // Danh sách playlist để chọn
  const [showPlaylistModal, setShowPlaylistModal] = useState(false); // Hiển thị modal chọn playlist
  const [videoToAdd, setVideoToAdd] = useState(null); // Video cần thêm vào playlist
  const [notification, setNotification] = useState(null); // Thông báo

  // Lấy danh sách playlist
  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/custom-playlists`);
      console.log("Playlists fetched:", response.data);
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

  useEffect(() => {
    fetchPlaylists();
  }, []);

  // Chọn video để phát
  const handleSelectVideo = (videoId, index) => {
    console.log("Selecting video:", { videoId, index, videoList });
    if (index >= 0 && index < videoList.length) {
      setSelectedVideoId(videoId);
      setCurrentIndex(index);
      setCurrentVideoInfo(videoList[index]);
    } else {
      const videoInfo = videoList.find((v) => v.id === videoId) || {
        id: videoId,
      };
      setSelectedVideoId(videoId);
      setCurrentIndex(-1);
      setCurrentVideoInfo(videoInfo);
    }
  };

  // Chuyển bài tiếp theo
  const handleNext = () => {
    if (!videoList.length) return;

    if (isRepeat && currentIndex >= 0) {
      setSelectedVideoId(videoList[currentIndex].id);
      return;
    }

    let nextIndex;
    if (isShuffle) {
      do {
        nextIndex = Math.floor(Math.random() * videoList.length);
      } while (nextIndex === currentIndex && videoList.length > 1);
    } else {
      nextIndex = currentIndex < videoList.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedVideoId(videoList[nextIndex].id);
    setCurrentIndex(nextIndex);
    setCurrentVideoInfo(videoList[nextIndex]);
    console.log("Next video:", { nextIndex, video: videoList[nextIndex] });
  };

  // Chuyển bài trước
  const handlePrevious = () => {
    if (!videoList.length) return;

    if (isRepeat && currentIndex >= 0) {
      setSelectedVideoId(videoList[currentIndex].id);
      return;
    }

    let prevIndex;
    if (isShuffle) {
      do {
        prevIndex = Math.floor(Math.random() * videoList.length);
      } while (prevIndex === currentIndex && videoList.length > 1);
    } else {
      prevIndex = currentIndex > 0 ? currentIndex - 1 : videoList.length - 1;
    }

    setSelectedVideoId(videoList[prevIndex].id);
    setCurrentIndex(prevIndex);
    setCurrentVideoInfo(videoList[prevIndex]);
    console.log("Previous video:", { prevIndex, video: videoList[prevIndex] });
  };

  // Phát video từ playlist
  const playFromPlaylist = (videoId, index, playlistVideos) => {
    console.log("Playing from playlist:", { videoId, index, playlistVideos });
    if (!videoId || !playlistVideos || !Array.isArray(playlistVideos)) {
      console.error("Invalid playlist data:", {
        videoId,
        index,
        playlistVideos,
      });
      return;
    }

    const validVideos = playlistVideos.filter(
      (video) =>
        video.id &&
        video.title &&
        video.channel &&
        typeof video.thumbnail === "string"
    );

    if (validVideos.length === 0) {
      console.error("No valid videos in playlist:", playlistVideos);
      setSelectedVideoId(null);
      setCurrentIndex(-1);
      setCurrentVideoInfo(null);
      setVideoList([]);
      return;
    }

    if (index < 0 || index >= validVideos.length) {
      console.error("Invalid index:", index);
      return;
    }

    setSelectedVideoId(videoId);
    setCurrentIndex(index);
    setVideoList(validVideos);
    setCurrentVideoInfo(validVideos[index]);
    console.log("Updated state:", {
      selectedVideoId: videoId,
      currentIndex: index,
      videoList: validVideos,
      currentVideoInfo: validVideos[index],
    });
  };

  // Mở modal chọn playlist để thêm video
  const handleOpenPlaylistModal = (videoId) => {
    setVideoToAdd(videoId);
    setShowPlaylistModal(true);
  };

  // Thêm video vào playlist
  const handleAddToPlaylist = async (playlistId) => {
    if (!videoToAdd) return;

    try {
      await axios.post(
        `${API_URL}/api/custom-playlists/${playlistId}/add-video`,
        { videoId: videoToAdd }
      );
      triggerPlaylistRefresh(); // Trigger làm mới playlist
      setShowPlaylistModal(false);
      setVideoToAdd(null);
      setNotification({
        message: "Đã thêm video vào playlist thành công!",
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
      fetchPlaylists(); // Làm mới danh sách playlist
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
    <div className="app-container">
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor:
              notification.type === "success" ? "#28a745" : "#dc3545",
            color: "white",
            padding: "10px 20px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            animation: "slideIn 0.5s ease-out",
          }}
        >
          {notification.message}
          <style>
            {`
              @keyframes slideIn {
                from {
                  transform: translateY(-100%);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
            `}
          </style>
        </div>
      )}

      <h1>Music Player App</h1>
      <div className="app-content">
        <div className="player-container">
          <Player
            videoId={selectedVideoId}
            videoInfo={currentVideoInfo}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={
              videoList.length > 0 &&
              (isRepeat || currentIndex < videoList.length - 1)
            }
            canGoPrevious={
              videoList.length > 0 && (isRepeat || currentIndex > 0)
            }
            isRepeat={isRepeat}
            setIsRepeat={setIsRepeat}
            isShuffle={isShuffle}
            setIsShuffle={setIsShuffle}
          />
          <Recommendations
            currentVideoId={selectedVideoId}
            onSelectVideo={handleSelectVideo}
          />
        </div>
        <div className="search-container">
          <Search
            onSelectVideo={handleSelectVideo}
            setVideoList={setVideoList}
            onAddToPlaylist={handleOpenPlaylistModal} // Truyền hàm mở modal
          />
          <CustomPlaylists
            onSelectVideo={handleSelectVideo}
            playFromPlaylist={playFromPlaylist}
            onAddToPlaylist={handleAddToPlaylist}
          />
        </div>
      </div>

      {/* {showPlaylistModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        > */}
      {/* <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              width: "300px",
            }}
          >
            <h3>Chọn playlist để thêm</h3>
            {playlists.length === 0 ? (
              <p>Chưa có playlist nào</p>
            ) : (
              <ul style={{ listStyle: "none", padding: "0" }}>
                {playlists.map((playlist) => (
                  <li
                    key={playlist._id}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                      cursor: "pointer",
                    }}
                    onClick={() => handleAddToPlaylist(playlist._id)}
                  >
                    {playlist.name} ({playlist.videos.length} video)
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => {
                setShowPlaylistModal(false);
                setVideoToAdd(null);
              }}
              style={{
                padding: "5px 10px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Đóng
            </button>
          </div> */}
      {/* </div>
      )} */}
    </div>
  );
};

export default MainApp;
