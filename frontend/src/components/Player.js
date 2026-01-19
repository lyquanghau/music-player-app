import React, { useState, useRef } from "react";
import ReactPlayer from "react-player/youtube";
import {
  GiPreviousButton,
  GiNextButton,
  GiPauseButton,
  GiPlayButton,
} from "react-icons/gi";
import { MdOutlineVolumeUp } from "react-icons/md";
import { LuRepeat1 } from "react-icons/lu";
import { FaRandom, FaPlus } from "react-icons/fa";

const Player = ({
  videoId,
  videoInfo,
  playlist = [],
  currentIndex = 0,
  onSelect,
  onAddToPlaylist, // 🔥 NEW
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isRepeat,
  setIsRepeat,
  isShuffle,
  setIsShuffle,
}) => {
  const playerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.84);

  const togglePlay = () => setIsPlaying((p) => !p);

  const onEnded = () => {
    if (isRepeat) {
      playerRef.current?.seekTo(0);
      setIsPlaying(true);
    } else {
      onNext();
    }
  };

  const handleSeekChange = (e) => {
    const value = parseFloat(e.target.value);
    setPlayed(value);
    playerRef.current.seekTo(value, "fraction");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      style={{
        background: "#f5f5f5",
        padding: 20,
        borderRadius: 12,
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: 20,
      }}
    >
      {/* ================= LEFT ================= */}
      <div>
        <h3>{videoInfo?.title || "Chưa chọn bài hát"}</h3>
        <p style={{ color: "#666" }}>{videoInfo?.channel || ""}</p>

        {videoId && (
          <>
            <ReactPlayer
              ref={playerRef}
              url={`https://www.youtube.com/watch?v=${videoId}`}
              playing={isPlaying}
              volume={volume}
              onEnded={onEnded}
              onProgress={(s) => setPlayed(s.played)}
              onDuration={setDuration}
              width="0"
              height="0"
              config={{ youtube: { playerVars: { controls: 0 } } }}
            />

            {/* Progress */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span>{formatTime(played * duration)}</span>
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                value={played}
                onChange={handleSeekChange}
                style={{ flex: 1 }}
              />
              <span>{formatTime(duration)}</span>
            </div>

            {/* Volume */}
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <MdOutlineVolumeUp />
              <input
                type="range"
                min={0}
                max={1}
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(+e.target.value)}
              />
              <span>{Math.round(volume * 100)}%</span>
            </div>
          </>
        )}

        {/* Controls */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button onClick={onPrevious} disabled={!canGoPrevious}>
            <GiPreviousButton />
          </button>

          <button onClick={togglePlay} disabled={!videoId}>
            {isPlaying ? <GiPauseButton /> : <GiPlayButton />}
          </button>

          <button onClick={onNext} disabled={!canGoNext}>
            <GiNextButton />
          </button>

          <button onClick={() => setIsRepeat(!isRepeat)}>
            <LuRepeat1 color={isRepeat ? "green" : "gray"} />
          </button>

          <button onClick={() => setIsShuffle(!isShuffle)}>
            <FaRandom color={isShuffle ? "green" : "gray"} />
          </button>

          {/* 🔥 ADD TO PLAYLIST */}
          <button
            onClick={() => onAddToPlaylist?.(videoId)}
            disabled={!videoId}
            title="Thêm vào playlist"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#2563eb",
              color: "#fff",
              borderRadius: 6,
              padding: "6px 10px",
            }}
          >
            <FaPlus /> Playlist
          </button>
        </div>
      </div>

      {/* ================= RIGHT – PLAYLIST ================= */}
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: 12,
          overflowY: "auto",
        }}
      >
        <h4>Danh sách phát</h4>

        {playlist.length === 0 ? (
          <p style={{ color: "#777" }}>Chưa có bài trong playlist</p>
        ) : (
          playlist.map((item, index) => (
            <div
              key={item.id}
              onClick={() => onSelect?.(index)}
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                cursor: "pointer",
                background: index === currentIndex ? "#2563eb" : "transparent",
                color: index === currentIndex ? "#fff" : "#000",
                marginBottom: 4,
              }}
            >
              ▶ Bài {index + 1}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Player;
