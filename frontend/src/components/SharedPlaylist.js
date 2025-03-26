import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { usePlaylist } from "../PlaylistContext"; // Import context

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8404";
const PLACEHOLDER_IMAGE = "https://placehold.co/50x50";

const SharedPlaylist = () => {
  console.log("Running SharedPlaylist.js version 1.4");

  const { id } = useParams();
  const { refreshTrigger } = usePlaylist(); // Sử dụng context
  const [playlist, setPlaylist] = useState(null);
  const [videoDetails, setVideoDetails] = useState(() => {
    const cachedDetails = localStorage.getItem("videoDetails");
    try {
      console.log("Cached videoDetails from localStorage:", cachedDetails);
      return cachedDetails ? JSON.parse(cachedDetails) : {};
    } catch (error) {
      console.error("Error parsing videoDetails from localStorage:", error);
      return {};
    }
  });
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem("videoDetails", JSON.stringify(videoDetails));
  }, [videoDetails]);

  const fetchPlaylist = async () => {
    try {
      const response = await axios.get(`${API_URL}/playlist/${id}`);
      console.log("Playlist data:", response.data);
      setPlaylist(response.data);
    } catch (err) {
      console.error("Lỗi khi lấy playlist:", err);
      setError("Không tìm thấy playlist hoặc có lỗi xảy ra.");
    }
  };

  const loadVideoDetails = async (videoIds) => {
    const missingVideoIds = videoIds.filter(
      (videoId) => !videoDetails[videoId]
    );
    if (missingVideoIds.length === 0) return;

    try {
      const response = await axios.post(`${API_URL}/api/videos/batch`, {
        videoIds: missingVideoIds,
      });
      console.log("Video details from API:", response.data);
      const details = response.data.reduce((acc, video) => {
        acc[video.id] = video;
        return acc;
      }, {});
      setVideoDetails((prev) => ({ ...prev, ...details }));
    } catch (error) {
      console.error("Lỗi khi lấy thông tin video:", error);
      setNotification({
        message: "Không thể lấy thông tin video. Vui lòng thử lại sau!",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
      const fallbackDetails = missingVideoIds.reduce((acc, videoId) => {
        acc[videoId] = {
          id: videoId,
          title: "Không tìm thấy video",
          channel: "Kênh không xác định",
          thumbnail: PLACEHOLDER_IMAGE,
        };
        return acc;
      }, {});
      setVideoDetails((prev) => ({ ...prev, ...fallbackDetails }));
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id, refreshTrigger]); // Sử dụng refreshTrigger từ context

  useEffect(() => {
    if (playlist && playlist.videos.length > 0) {
      loadVideoDetails(playlist.videos);
    }
  }, [playlist]);

  if (error) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <h2 style={{ color: "#dc3545" }}>{error}</h2>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <h2>Đang tải...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        position: "relative",
      }}
    >
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

      <h2 style={{ fontSize: "1.5em", marginBottom: "20px", color: "#333" }}>
        {playlist.name}
      </h2>
      {playlist.videos.length === 0 ? (
        <p style={{ color: "#666" }}>Playlist này chưa có video nào.</p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: "0",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          {playlist.videos.map((videoId, index) => {
            const video = videoDetails[videoId] || {};
            console.log(`Video details for ${videoId}:`, video); // Debug
            return (
              <li
                key={videoId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "15px",
                  borderBottom:
                    index < playlist.videos.length - 1
                      ? "1px solid #eee"
                      : "none",
                }}
              >
                <img
                  src={video.thumbnail || PLACEHOLDER_IMAGE}
                  alt={video.title || "Video"}
                  style={{
                    width: "60px",
                    height: "40px",
                    borderRadius: "4px",
                    objectFit: "cover",
                  }}
                  loading="lazy"
                  onError={(e) => {
                    if (e.target.src !== PLACEHOLDER_IMAGE) {
                      e.target.src = PLACEHOLDER_IMAGE;
                    }
                  }}
                />
                <div style={{ flex: "1" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "16px",
                    }}
                  >
                    {video.title || "Không tìm thấy video"}
                  </div>
                  <div style={{ color: "#666", fontSize: "14px" }}>
                    {video.channel || "Kênh không xác định"}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SharedPlaylist;
