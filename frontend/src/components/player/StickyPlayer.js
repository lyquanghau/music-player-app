import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Repeat,
  Shuffle,
  Volume2,
  VolumeX,
  Video,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../../context/PlayerContext";
import "./StickyPlayer.css";

const format = (t = 0) =>
  `${Math.floor(t / 60)}:${Math.floor(t % 60)
    .toString()
    .padStart(2, "0")}`;

export default function StickyPlayer() {
  const navigate = useNavigate();
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
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <>
      {/* ================= PROGRESS – NẰM NGOÀI STICKY ================= */}
      <div className="global-progress">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={(e) => seekTo(Number(e.target.value))}
        />
        <div className="time-row">
          <span>{format(currentTime)}</span>
          <span>{format(duration)}</span>
        </div>
      </div>

      {/* ================= STICKY PLAYER ================= */}
      <div className="sticky-player">
        <div className="player-body">
          {/* LEFT */}
          <div className="player-left">
            <img src={currentTrack.thumbnail} alt="" />
            <div>
              <div className="title">{currentTrack.title}</div>
              <div className="artist">{currentTrack.channel}</div>
            </div>
            <button className="icon-btn">
              <Heart size={16} />
            </button>
          </div>

          {/* CENTER */}
          <div className="player-center">
            <button className="icon-btn" onClick={playPrev}>
              <SkipBack />
            </button>

            <button className="play-btn" onClick={togglePlay}>
              {isPlaying ? <Pause /> : <Play />}
            </button>

            <button className="icon-btn" onClick={playNext}>
              <SkipForward />
            </button>

            <button
              className={`icon-btn ${repeatMode === "one" ? "active" : ""}`}
              onClick={() =>
                setRepeatMode(repeatMode === "all" ? "one" : "all")
              }
              title={repeatMode === "one" ? "Lặp 1 bài" : "Phát tuần tự"}
            >
              <Repeat />
            </button>

            <button
              className={`icon-btn ${shuffle ? "active" : ""}`}
              onClick={() => setShuffle((s) => !s)}
            >
              <Shuffle />
            </button>
          </div>

          {/* RIGHT */}
          <div className="player-right">
            <button className="icon-btn" onClick={toggleMute}>
              {muted ? <VolumeX /> : <Volume2 />}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
            />

            <button
              className="mv-btn"
              onClick={() => navigate(`/play/${currentTrack.id}?mv=true`)}
            >
              <Video size={14} /> <span>MV</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
