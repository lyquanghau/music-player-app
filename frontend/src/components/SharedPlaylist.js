import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SharedPlaylist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [videoDetails, setVideoDetails] = useState({});
  const [error, setError] = useState(null);

  const fetchPlaylist = async () => {
    try {
      const response = await axios.get(`http://localhost:8404/playlist/${id}`); // Bỏ /api
      setPlaylist(response.data);
    } catch (err) {
      console.error("Lỗi khi lấy playlist:", err);
      setError("Không tìm thấy playlist hoặc có lỗi xảy ra.");
    }
  };

  const fetchVideoDetails = async (videoId) => {
    try {
      const response = await axios.get(
        `http://localhost:8404/api/video/${videoId}`
      ); // Giữ /api vì route /video/:id vẫn nằm trong /api
      const video = response.data;
      return {
        id: video.id || videoId,
        title: video.title || "Không tìm thấy",
        channel: video.channel || "Không xác định",
        thumbnail: video.thumbnail || "",
      };
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin video ${videoId}:`, error);
      return {
        id: videoId,
        title: "Không tìm thấy",
        channel: "Không xác định",
        thumbnail: "",
      };
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  useEffect(() => {
    if (playlist && playlist.videos.length > 0) {
      const loadVideoDetails = async () => {
        const details = {};
        for (const videoId of playlist.videos) {
          if (!videoDetails[videoId]) {
            const videoInfo = await fetchVideoDetails(videoId);
            details[videoId] = videoInfo;
          }
        }
        setVideoDetails((prev) => ({ ...prev, ...details }));
      };
      loadVideoDetails();
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
      }}
    >
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
                  src={video.thumbnail || "https://via.placeholder.com/50"}
                  alt={video.title || "Video"}
                  style={{
                    width: "60px",
                    height: "40px",
                    borderRadius: "4px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/50";
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
                    {video.title || "Đang tải..."}
                  </div>
                  <div style={{ color: "#666", fontSize: "14px" }}>
                    {video.channel || ""}
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
