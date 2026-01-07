// src/components/CustomPlaylists.js
import React, { useEffect, useState } from "react";
import api from "../api/api";
import { QRCodeCanvas } from "qrcode.react";
import { usePlaylist } from "../PlaylistContext";

import { FaEye, FaShareAltSquare } from "react-icons/fa";
import { GiPlayButton } from "react-icons/gi";
import { MdDeleteForever, MdContentCopy } from "react-icons/md";

const PLACEHOLDER_IMAGE = "https://placehold.co/50x50";

const CustomPlaylists = ({ playFromPlaylist }) => {
  // ===== CONTEXT =====
  const { refreshTrigger } = usePlaylist();

  // ===== STATE =====
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [videoDetails, setVideoDetails] = useState({});
  const [notification, setNotification] = useState(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // ===== EFFECT =====
  useEffect(() => {
    fetchPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // ===== API =====
  const fetchPlaylists = async () => {
    try {
      const res = await api.get("/custom-playlists");
      setPlaylists(res.data);

      if (selectedPlaylist) {
        const updated = res.data.find((p) => p._id === selectedPlaylist._id);
        setSelectedPlaylist(updated || null);

        if (updated?.videos?.length) {
          loadVideoDetails(updated.videos);
        }
      }
    } catch {
      showError("Không thể lấy danh sách playlist");
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      const res = await api.post("/custom-playlists", {
        name: newPlaylistName.trim(),
      });

      setPlaylists((prev) => [res.data, ...prev]);
      setNewPlaylistName("");
      showSuccess("Tạo playlist thành công");
    } catch {
      showError("Không thể tạo playlist");
    }
  };

  const removeVideoFromPlaylist = async (playlistId, videoId) => {
    try {
      await api.post(`/custom-playlists/${playlistId}/remove-video`, {
        videoId,
      });
      await fetchPlaylists();
      showSuccess("Đã xóa video khỏi playlist");
    } catch {
      showError("Không thể xóa video");
    }
  };

  // ===== VIDEO DETAILS =====
  const loadVideoDetails = async (videoIds) => {
    const missing = videoIds.filter((id) => !videoDetails[id]);
    if (!missing.length) return;

    try {
      const res = await api.post("/videos/batch", { videoIds: missing });
      const mapped = {};
      res.data.forEach((v) => {
        mapped[v.id] = v;
      });
      setVideoDetails((prev) => ({ ...prev, ...mapped }));
    } catch {
      const fallback = {};
      missing.forEach((id) => {
        fallback[id] = {
          id,
          title: "Không tìm thấy video",
          channel: "Không xác định",
          thumbnail: PLACEHOLDER_IMAGE,
        };
      });
      setVideoDetails((prev) => ({ ...prev, ...fallback }));
    }
  };

  // ===== UI HANDLERS =====
  const viewPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    if (playlist.videos.length) {
      loadVideoDetails(playlist.videos);
    }
  };

  const sharePlaylist = (url) => {
    setShareUrl(url);
    setShowShareModal(true);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    showSuccess("Đã sao chép link chia sẻ");
  };

  // ===== NOTIFICATION =====
  const showSuccess = (message) => {
    setNotification({ type: "success", message });
    setTimeout(() => setNotification(null), 2500);
  };

  const showError = (message) => {
    setNotification({ type: "error", message });
    setTimeout(() => setNotification(null), 2500);
  };

  // ===== RENDER =====
  return (
    <div style={{ padding: 20, background: "#f5f5f5", borderRadius: 8 }}>
      {/* Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            padding: "10px 20px",
            background: notification.type === "success" ? "#28a745" : "#dc3545",
            color: "#fff",
            borderRadius: 4,
            zIndex: 1000,
          }}
        >
          {notification.message}
        </div>
      )}

      <h2>Danh sách phát tự tạo</h2>

      {/* Create playlist */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="Tên playlist mới"
          style={{ padding: 8 }}
        />
        <button onClick={createPlaylist} style={{ marginLeft: 10 }}>
          Tạo
        </button>
      </div>

      {/* Playlist list */}
      {playlists.length === 0 ? (
        <p>Chưa có playlist</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {playlists.map((p) => (
            <li
              key={p._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 10,
                background: "#fff",
                marginBottom: 5,
              }}
            >
              <div>
                <b>{p.name}</b>
                <div>{p.videos.length} video</div>
              </div>
              <div>
                <button onClick={() => viewPlaylist(p)}>
                  <FaEye />
                </button>
                <button onClick={() => sharePlaylist(p.shareUrl)}>
                  <FaShareAltSquare />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Playlist detail */}
      {selectedPlaylist && (
        <div style={{ marginTop: 30 }}>
          <h3>{selectedPlaylist.name}</h3>

          {selectedPlaylist.videos.map((vid, index) => {
            const v = videoDetails[vid] || {};
            return (
              <div
                key={vid}
                style={{ display: "flex", gap: 10, marginBottom: 10 }}
              >
                <img src={v.thumbnail || PLACEHOLDER_IMAGE} width={50} alt="" />
                <div style={{ flex: 1 }}>
                  <b>{v.title}</b>
                  <div>{v.channel}</div>
                </div>
                <button
                  onClick={() =>
                    playFromPlaylist(
                      vid,
                      index,
                      selectedPlaylist.videos.map((id) => ({
                        id,
                        ...(videoDetails[id] || {}),
                      }))
                    )
                  }
                >
                  <GiPlayButton />
                </button>
                <button
                  onClick={() =>
                    removeVideoFromPlaylist(selectedPlaylist._id, vid)
                  }
                >
                  <MdDeleteForever />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Share modal */}
      {showShareModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
            <p>{shareUrl}</p>
            <button onClick={copyToClipboard}>
              <MdContentCopy />
            </button>
            <QRCodeCanvas value={shareUrl} size={150} />
            <button onClick={() => setShowShareModal(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPlaylists;
