import React, { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { usePlaylist } from "../PlaylistContext";

import { FaEye, FaShareAltSquare } from "react-icons/fa";
import { GiPlayButton } from "react-icons/gi";
import { MdDeleteForever, MdContentCopy } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8404";
const PLACEHOLDER_IMAGE = "https://placehold.co/50x50";

const CustomPlaylists = ({
  onSelectVideo,
  playFromPlaylist,
  onAddToPlaylist,
}) => {
  console.log("Running CustomPlaylists.js version 1.7"); // Cập nhật phiên bản

  const { refreshTrigger } = usePlaylist();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
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
  const [notification, setNotification] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    localStorage.setItem("videoDetails", JSON.stringify(videoDetails));
  }, [videoDetails]);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/custom-playlists`);
      console.log("Playlists fetched in CustomPlaylists:", response.data);
      setPlaylists(response.data);

      // Cập nhật selectedPlaylist nếu đang xem
      if (selectedPlaylist) {
        const updatedPlaylist = response.data.find(
          (p) => p._id === selectedPlaylist._id
        );
        if (updatedPlaylist) {
          setSelectedPlaylist(updatedPlaylist);
          if (updatedPlaylist.videos.length > 0) {
            loadVideoDetails(updatedPlaylist.videos);
          }
        } else {
          setSelectedPlaylist(null); // Nếu playlist không còn tồn tại (bị xóa), đặt lại về null
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách playlist:", error);
      setNotification({
        message: "Không thể lấy danh sách playlist!",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
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

  const createPlaylist = async () => {
    if (!newPlaylistName) return;
    try {
      const response = await axios.post(`${API_URL}/api/custom-playlists`, {
        name: newPlaylistName,
        videos: [],
      });
      setPlaylists([...playlists, response.data]);
      setNewPlaylistName("");
      setNotification({
        message: "Tạo playlist thành công!",
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Lỗi khi tạo playlist:", error);
      setNotification({
        message: "Không thể tạo playlist!",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleViewPlaylist = async (playlist) => {
    setSelectedPlaylist(playlist);
    if (playlist.videos.length > 0) {
      loadVideoDetails(playlist.videos);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setNotification({
        message: "Đã sao chép URL chia sẻ!",
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
    });
  };

  const handleShare = (url) => {
    const cleanUrl = url.replace("/api", "");
    setShareUrl(cleanUrl);
    setShowShareModal(true);
  };

  const handleRemoveFromPlaylist = async (playlistId, videoId) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/custom-playlists/${playlistId}/remove-video`,
        { videoId }
      );
      await fetchPlaylists();
      setNotification({
        message: "Đã xóa video khỏi playlist!",
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Lỗi khi xóa video khỏi playlist:", error);
      setNotification({
        message: "Có lỗi xảy ra khi xóa video!",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [refreshTrigger]);

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        marginTop: "20px",
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

      <h2 style={{ fontSize: "1.5em", marginBottom: "10px" }}>
        Danh sách phát tự tạo
      </h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="Tên playlist mới"
          style={{
            padding: "8px",
            width: "200px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={createPlaylist}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          Tạo
        </button>
      </div>

      {playlists.length === 0 ? (
        <p style={{ color: "#666" }}>Chưa có danh sách phát nào</p>
      ) : (
        <ul style={{ listStyle: "none", padding: "0" }}>
          {playlists.map((playlist) => (
            <li
              key={playlist._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #eee",
                backgroundColor: "#f9f9f9",
              }}
            >
              <div>
                <div style={{ fontWeight: "bold", color: "#333" }}>
                  {playlist.name}
                </div>
                <div style={{ color: "#666", fontSize: "14px" }}>
                  {playlist.videos.length} video
                </div>
              </div>
              <div>
                <button
                  onClick={() => handleViewPlaylist(playlist)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleShare(playlist.shareUrl)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  <FaShareAltSquare />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedPlaylist && (
        <div style={{ marginTop: "20px" }}>
          <h3>{selectedPlaylist.name}</h3>
          {selectedPlaylist.videos.length === 0 ? (
            <p>Chưa có video trong playlist này</p>
          ) : (
            <ul style={{ listStyle: "none", padding: "0" }}>
              {selectedPlaylist.videos.map((videoId, index) => {
                const video = videoDetails[videoId] || {};
                console.log(`Video details for ${videoId}:`, video);
                return (
                  <li
                    key={videoId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <img
                      src={video.thumbnail || PLACEHOLDER_IMAGE}
                      alt={video.title || "Video"}
                      style={{ width: "50px", borderRadius: "4px" }}
                      loading="lazy"
                      onError={(e) => {
                        if (e.target.src !== PLACEHOLDER_IMAGE) {
                          e.target.src = PLACEHOLDER_IMAGE;
                        }
                      }}
                    />
                    <div style={{ flex: "1" }}>
                      <div style={{ fontWeight: "bold", color: "#333" }}>
                        {video.title || "Không tìm thấy video"}
                      </div>
                      <div style={{ color: "#666", fontSize: "14px" }}>
                        {video.channel || "Kênh không xác định"}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const playlistVideos = selectedPlaylist.videos.map(
                          (id) => {
                            const vid = videoDetails[id] || {};
                            return {
                              id: id,
                              title: vid.title || "Không tìm thấy video",
                              channel: vid.channel || "Kênh không xác định",
                              thumbnail: vid.thumbnail || PLACEHOLDER_IMAGE,
                            };
                          }
                        );
                        console.log("Playlist videos to play:", playlistVideos);
                        playFromPlaylist(videoId, index, playlistVideos);
                      }}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                    >
                      <GiPlayButton />
                    </button>
                    <button
                      onClick={() =>
                        handleRemoveFromPlaylist(selectedPlaylist._id, videoId)
                      }
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <MdDeleteForever />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {showShareModal && (
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
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              width: "300px",
            }}
          >
            <h3>Chia sẻ danh sách phát</h3>
            <p style={{ wordBreak: "break-all", marginBottom: "10px" }}>
              {shareUrl}
            </p>
            <button
              onClick={() => copyToClipboard(shareUrl)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginBottom: "10px",
              }}
            >
              <MdContentCopy />
            </button>
            <div style={{ margin: "20px 0" }}>
              <QRCodeCanvas value={shareUrl} size={150} />
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <MdDeleteForever />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPlaylists;
