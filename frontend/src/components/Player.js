import React, { useState, useRef } from "react";
import ReactPlayer from "react-player/youtube";

const Player = ({
  videoId,
  videoInfo,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isRepeat,
  setIsRepeat,
  isShuffle,
  setIsShuffle,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);

  const onEnded = () => {
    console.log("Video ended, checking repeat or next");
    if (isRepeat) {
      setIsPlaying(true);
    } else {
      onNext();
    }
  };

  const togglePlay = () => {
    console.log("Toggling play, isPlaying:", isPlaying);
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
    console.log(
      "Progress:",
      state.playedSeconds,
      "Duration:",
      state.loadedSeconds
    );
  };

  const handleDuration = (duration) => {
    setDuration(duration);
    console.log("Duration set:", duration);
  };

  const handleSeekChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setPlayed(newValue);
    playerRef.current.seekTo(newValue, "fraction");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ fontSize: "1.5em", marginBottom: "10px" }}>
        {videoInfo?.title || "Chưa chọn video"}
      </h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        {videoInfo?.channel || ""}
      </p>
      {videoId ? (
        <>
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${videoId}`}
            playing={isPlaying}
            onEnded={onEnded}
            onProgress={handleProgress}
            onDuration={handleDuration}
            width="0"
            height="0"
            config={{
              youtube: {
                playerVars: { controls: 0, showinfo: 0 },
              },
            }}
            onError={(e) => console.error("ReactPlayer error:", e)}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
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
          {/* <div style={{ marginBottom: "10px", color: "#666" }}>
            Debug: videoId={videoId}, canGoPrevious={canGoPrevious}, canGoNext=
            {canGoNext}
          </div> */}
        </>
      ) : (
        <p style={{ color: "#666" }}>Vui lòng chọn một video để phát</p>
      )}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
          justifyContent: "center",
        }}
      >
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          style={{
            padding: "8px 16px",
            backgroundColor: canGoPrevious ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: canGoPrevious ? "pointer" : "not-allowed",
          }}
        >
          Trước
        </button>
        <button
          onClick={togglePlay}
          disabled={!videoId}
          style={{
            padding: "8px 16px",
            backgroundColor: videoId ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: videoId ? "pointer" : "not-allowed",
          }}
        >
          {isPlaying ? "Tạm dừng" : "Phát"}
        </button>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          style={{
            padding: "8px 16px",
            backgroundColor: canGoNext ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: canGoNext ? "pointer" : "not-allowed",
          }}
        >
          Tiếp
        </button>
        <button
          onClick={() => setIsRepeat(!isRepeat)}
          style={{
            padding: "8px 16px",
            backgroundColor: isRepeat ? "#28a745" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isRepeat ? "Tắt lặp" : "Bật lặp"}
        </button>
        <button
          onClick={() => setIsShuffle(!isShuffle)}
          style={{
            padding: "8px 16px",
            backgroundColor: isShuffle ? "#28a745" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isShuffle ? "Tắt ngẫu nhiên" : "Bật ngẫu nhiên"}
        </button>
      </div>
    </div>
  );
};

export default Player;
