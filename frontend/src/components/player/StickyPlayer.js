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
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { usePlayer } from "../../context/PlayerContext";
import "./StickyPlayer.css";

const formatTime = (seconds = 0) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function StickyPlayer() {
  const location = useLocation();

  const {
    currentTrack,
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

  /* =====================================================
     GUARD: KHÔNG RENDER TRONG CÁC TRƯỜNG HỢP
  ===================================================== */
  if (!currentTrack || location.pathname === "/" || isMVMode) {
    return null;
  }

  /* =====================================================
     HANDLERS
  ===================================================== */
  const handleRepeatClick = () => {
    if (repeatMode === "off") setRepeatMode("all");
    else if (repeatMode === "all") setRepeatMode("one");
    else setRepeatMode("off");
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <div className="sticky-player-container">
      {/* ===== PROGRESS ===== */}
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

      {/* ===== MAIN BODY ===== */}
      <div className="player-main-body">
        {/* ================= LEFT ================= */}
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
              size={20}
              fill={isLiked(currentTrack.id) ? "#ff4d4f" : "none"}
            />
          </button>
        </div>

        {/* ================= CENTER ================= */}
        <div className="body-center">
          <div className="control-buttons">
            <button
              className={`sub-btn repeat-btn ${
                repeatMode !== "off" ? "active" : ""
              }`}
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

            {/* 🔒 CHẶN AUDIO TUYỆT ĐỐI KHI MV MODE */}
            <button
              className="main-play-btn"
              onClick={() => {
                if (isMVMode) return;
                togglePlay();
              }}
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

        {/* ================= RIGHT ================= */}
        <div className="body-right">
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

          {/* ================= MV BUTTON ================= */}
          <button
            className="btn-go-mv"
            onClick={() => {
              // ⏸ TẮT AUDIO NGAY LẬP TỨC
              if (isPlaying) togglePlay(false);

              // 🎬 VÀO MV MODE
              setIsMVMode(true);
              setShowMV(true);

              // 📍 SCROLL XUỐNG MV
              setTimeout(() => {
                const el = document.getElementById("mv");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }, 100);
            }}
          >
            MV
          </button>
        </div>
      </div>
    </div>
  );
}
