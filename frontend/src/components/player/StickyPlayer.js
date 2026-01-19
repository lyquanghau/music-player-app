import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Repeat,
  Repeat1,
  Shuffle,
  Volume2,
  VolumeX,
  Plus,
  ListMusic,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { usePlaylist } from "../../PlaylistContext";
import api from "../../api/api";
import "./StickyPlayer.css";

const formatTime = (seconds = 0) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function StickyPlayer() {
  const location = useLocation();

  /* ================= CONTEXT ================= */
  const {
    currentTrack,
    queue,
    currentIndex,
    selectTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    currentTime,
    duration,
    seekTo,
    repeatMode,
    setRepeatMode,
    shuffle,
    setShuffle,
    volume,
    muted,
    toggleMute,
    changeVolume,
    toggleLike,
    isLiked,
    setShowMV,
    setIsMVMode,
    isMVMode,
  } = usePlayer();

  const { triggerPlaylistRefresh } = usePlaylist();

  /* ================= LOCAL STATE ================= */
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (!showPlaylistModal) return;

    let mounted = true;
    api
      .get("/custom-playlists")
      .then((res) => mounted && setPlaylists(res.data || []))
      .catch(() => mounted && setPlaylists([]));

    return () => {
      mounted = false;
    };
  }, [showPlaylistModal]);

  /* ================= GUARD ================= */
  if (!currentTrack || location.pathname === "/" || isMVMode) return null;

  /* ================= HELPERS ================= */
  const isTrackInPlaylist = (playlist) =>
    playlist.videos.includes(currentTrack.id);

  /* ================= HANDLERS ================= */
  const handleRepeatClick = () => {
    if (repeatMode === "off") setRepeatMode("all");
    else if (repeatMode === "all") setRepeatMode("one");
    else setRepeatMode("off");
  };

  const handleAddToPlaylist = async (playlistId) => {
    if (loading) return;
    try {
      setLoading(true);
      await api.post(`/custom-playlists/${playlistId}/add-video`, {
        videoId: currentTrack.id,
      });
      triggerPlaylistRefresh();
      setShowPlaylistModal(false);
    } catch {
      alert("Không thể thêm vào playlist");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim() || loading) return;

    try {
      setLoading(true);
      const res = await api.post("/custom-playlists", {
        name: newPlaylistName.trim(),
      });

      await api.post(`/custom-playlists/${res.data._id}/add-video`, {
        videoId: currentTrack.id,
      });

      triggerPlaylistRefresh();
      setNewPlaylistName("");
      setShowPlaylistModal(false);
    } catch {
      alert("Không thể tạo playlist");
    } finally {
      setLoading(false);
    }
  };

  const progressPercent =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  /* ================= RENDER ================= */
  return (
    <>
      <div className="sticky-player-container">
        {/* PROGRESS */}
        <div className="sticky-progress-wrapper">
          <input
            type="range"
            className="main-progress-bar"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seekTo(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #2563eb ${progressPercent}%, #334155 ${progressPercent}%)`,
            }}
          />
          <div className="time-display-row">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-main-body">
          {/* LEFT */}
          <div className="body-left">
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              className="player-thumb"
            />
            <div className="track-meta">
              <div className="track-name">{currentTrack.title}</div>
              <div className="track-channel">{currentTrack.channel}</div>
            </div>
            <button
              className={`like-btn-sticky ${
                isLiked(currentTrack.id) ? "active" : ""
              }`}
              onClick={() => toggleLike(currentTrack.id)}
            >
              <Heart
                size={18}
                fill={isLiked(currentTrack.id) ? "#ff4d4f" : "none"}
              />
            </button>
          </div>

          {/* CENTER */}
          <div className="body-center">
            <div className="control-buttons">
              <button
                className={`sub-btn ${repeatMode !== "off" ? "active" : ""}`}
                onClick={handleRepeatClick}
              >
                {repeatMode === "one" ? (
                  <Repeat1 size={18} />
                ) : (
                  <Repeat size={18} />
                )}
              </button>

              <button className="sub-btn" onClick={playPrev}>
                <SkipBack size={20} />
              </button>

              <button
                className="main-play-btn"
                onClick={() => !isMVMode && togglePlay()}
              >
                {isPlaying ? (
                  <Pause size={24} fill="white" />
                ) : (
                  <Play size={24} fill="white" />
                )}
              </button>

              <button className="sub-btn" onClick={playNext}>
                <SkipForward size={20} />
              </button>

              <button
                className={`sub-btn ${shuffle ? "active" : ""}`}
                onClick={() => setShuffle(!shuffle)}
              >
                <Shuffle size={18} />
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="body-right">
            <button
              className="sub-btn"
              title="Queue"
              onClick={() => setShowQueue(!showQueue)}
            >
              <ListMusic size={18} />
            </button>

            <button
              className="sub-btn"
              title="Thêm vào playlist"
              onClick={() => setShowPlaylistModal(true)}
            >
              <Plus size={18} />
            </button>

            <div className="volume-section">
              <button className="sub-btn" onClick={toggleMute}>
                {muted || volume === 0 ? (
                  <VolumeX size={18} />
                ) : (
                  <Volume2 size={18} />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={muted ? 0 : volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                className="volume-range"
              />
            </div>

            <button
              className="btn-go-mv"
              onClick={() => {
                togglePlay(false);
                setIsMVMode(true);
                setShowMV(true);
              }}
            >
              MV
            </button>
          </div>
        </div>
      </div>

      {/* QUEUE */}
      {showQueue && queue.length > 1 && (
        <div className="sticky-queue">
          <div className="queue-title">Danh sách phát</div>
          <div className="queue-list">
            {queue.map((t, i) => (
              <div
                key={t.id}
                className={`queue-item ${i === currentIndex ? "active" : ""}`}
                onClick={() => selectTrack(i)}
              >
                <img src={t.thumbnail} alt="" />
                <div className="queue-meta">
                  <div className="queue-name">{t.title}</div>
                  <div className="queue-channel">{t.channel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PLAYLIST MODAL */}
      {showPlaylistModal && (
        <div className="playlist-modal-overlay">
          <div className="playlist-modal">
            <h3>Thêm vào playlist</h3>

            <div className="playlist-list">
              {playlists.map((p) => (
                <button
                  key={p._id}
                  disabled={isTrackInPlaylist(p)}
                  title={
                    isTrackInPlaylist(p)
                      ? "Bài đã tồn tại"
                      : "Thêm vào playlist"
                  }
                  onClick={() => handleAddToPlaylist(p._id)}
                >
                  {p.name} ({p.videos.length})
                </button>
              ))}
            </div>

            <div className="playlist-create">
              <input
                placeholder="Tên playlist mới"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
              />
              <button onClick={handleCreatePlaylist}>Tạo & thêm</button>
            </div>

            <button
              className="playlist-close"
              onClick={() => setShowPlaylistModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
