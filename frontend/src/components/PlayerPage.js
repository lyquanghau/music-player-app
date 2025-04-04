import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../AuthContext";
import Player from "./Player";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8404";

const PlayerPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  // State để quản lý danh sách phát và trạng thái
  const [videoList, setVideoList] = useState([]); // Danh sách video từ Search hoặc playlist
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Chỉ số video hiện tại
  const [isRepeat, setIsRepeat] = useState(false); // Lặp lại
  const [isShuffle, setIsShuffle] = useState(false); // Xáo trộn

  // Lấy danh sách video từ localStorage hoặc API (giả lập từ Search)
  useEffect(() => {
    const fetchVideoList = async () => {
      try {
        // Giả sử danh sách video được lưu trong localStorage từ Search
        const cachedVideos = localStorage.getItem("searchResults");
        if (cachedVideos) {
          const videos = JSON.parse(cachedVideos).videos || [];
          setVideoList(videos);
          const index = videos.findIndex((v) => v.id === videoId);
          setCurrentVideoIndex(index >= 0 ? index : 0);
        } else {
          // Nếu không có danh sách, gọi API để lấy thông tin video đơn lẻ
          const response = await axios.get(`${API_URL}/api/video/${videoId}`);
          setVideoList([
            {
              id: videoId,
              title: response.data.title,
              channel: response.data.channel,
            },
          ]);
          setCurrentVideoIndex(0);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách video:", error);
      }
    };

    fetchVideoList();
  }, [videoId]);

  // Xử lý nút Next
  const handleNext = () => {
    if (videoList.length === 0) return;

    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * videoList.length);
    } else {
      nextIndex = (currentVideoIndex + 1) % videoList.length; // Quay vòng nếu hết danh sách
    }

    setCurrentVideoIndex(nextIndex);
    const nextVideoId = videoList[nextIndex].id;
    navigate(`/play/${nextVideoId}`); // Chuyển hướng sang video tiếp theo
  };

  // Xử lý nút Previous
  const handlePrevious = () => {
    if (videoList.length === 0) return;

    let prevIndex;
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * videoList.length);
    } else {
      prevIndex =
        currentVideoIndex - 1 >= 0
          ? currentVideoIndex - 1
          : videoList.length - 1; // Quay vòng ngược
    }

    setCurrentVideoIndex(prevIndex);
    const prevVideoId = videoList[prevIndex].id;
    navigate(`/play/${prevVideoId}`); // Chuyển hướng sang video trước đó
  };

  // Xử lý khi video kết thúc
  const handleEnded = () => {
    if (isRepeat) {
      // Lặp lại video hiện tại (Player sẽ tự động phát lại nhờ ReactPlayer)
      return;
    }
    handleNext(); // Chuyển sang video tiếp theo nếu không lặp
  };

  // Nút quay lại trang chính
  const handleBack = () => {
    navigate("/player");
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Nút quay lại */}
      <div style={{ width: "100%", maxWidth: "800px", marginBottom: "20px" }}>
        <button
          onClick={handleBack}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Quay lại
        </button>
      </div>

      {/* Tiêu đề */}
      <h1 style={{ fontSize: "1.5rem", color: "#333", marginBottom: "20px" }}>
        Đang phát: {videoList[currentVideoIndex]?.title || "Đang tải..."}
      </h1>

      {/* Component Player */}
      <Player
        videoId={videoId}
        videoInfo={videoList[currentVideoIndex] || { id: videoId }} // Truyền thông tin video
        onNext={handleNext}
        onPrevious={handlePrevious}
        canGoNext={
          videoList.length > 1 && currentVideoIndex < videoList.length - 1
        }
        canGoPrevious={videoList.length > 1 && currentVideoIndex > 0}
        isRepeat={isRepeat}
        setIsRepeat={setIsRepeat}
        isShuffle={isShuffle}
        setIsShuffle={setIsShuffle}
        onEnded={handleEnded} // Thêm sự kiện khi video kết thúc
      />
    </div>
  );
};

export default PlayerPage;
