import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";

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
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const onReady = (event) => {
    setPlayer(event.target);
    event.target.setVolume(volume);
    event.target.playVideo();
    setIsPlaying(true);
    setDuration(event.target.getDuration());
  };

  const onStateChange = (event) => {
    setIsPlaying(event.data === 1);
    if (event.data === 0) {
      onNext();
    }
  };

  const togglePlay = () => {
    if (player) {
      isPlaying ? player.pauseVideo() : player.playVideo();
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
    }
  };

  const handleSeekChange = (event) => {
    const seekTo = parseFloat(event.target.value);
    setCurrentTime(seekTo);
    if (player) {
      player.seekTo(seekTo, true);
    }
  };

  useEffect(() => {
    let interval;
    if (player && isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [player, isPlaying]);

  useEffect(() => {
    setPlayer(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [videoId]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      style={{
        maxWidth: "100%",
        margin: "0 auto",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ fontSize: "1.5em", marginBottom: "10px" }}>
        Trình phát nhạc
      </h2>
      {videoId && typeof videoId === "string" ? (
        <div>
          <div style={{ display: "none" }}>
            <YouTube
              videoId={videoId}
              opts={{
                height: "100%",
                width: "100%",
                playerVars: { autoplay: 0 },
              }}
              onReady={onReady}
              onStateChange={onStateChange}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <p
              style={{
                fontSize: "1.1em",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "5px",
              }}
            >
              Đang phát: {videoInfo?.title || "Không có tiêu đề"} -{" "}
              {videoInfo?.channel || "Không có kênh"}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "0.9em", color: "#666" }}>
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 1}
                value={currentTime}
                onChange={handleSeekChange}
                style={{
                  flex: 1,
                  height: "8px",
                  borderRadius: "4px",
                  background: `linear-gradient(to right, #007bff ${
                    (currentTime / (duration || 1)) * 100
                  }%, #ddd 0%)`,
                  cursor: "pointer",
                }}
              />
              <span style={{ fontSize: "0.9em", color: "#666" }}>
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ color: "#666" }}>Chọn một video để phát</p>
      )}
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginTop: "10px",
          alignItems: "center",
          flexWrap: "wrap",
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
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            canGoPrevious && (e.currentTarget.style.backgroundColor = "#0056b3")
          }
          onMouseLeave={(e) =>
            canGoPrevious && (e.currentTarget.style.backgroundColor = "#007bff")
          }
        >
          Previous
        </button>
        <button
          onClick={togglePlay}
          disabled={!player}
          style={{
            padding: "8px 16px",
            backgroundColor: player ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: player ? "pointer" : "not-allowed",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            player && (e.currentTarget.style.backgroundColor = "#0056b3")
          }
          onMouseLeave={(e) =>
            player && (e.currentTarget.style.backgroundColor = "#007bff")
          }
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
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            canGoNext && (e.currentTarget.style.backgroundColor = "#0056b3")
          }
          onMouseLeave={(e) =>
            canGoNext && (e.currentTarget.style.backgroundColor = "#007bff")
          }
        >
          Next
        </button>
        <button
          onClick={() => setIsRepeat(!isRepeat)}
          style={{
            padding: "8px 16px",
            backgroundColor: isRepeat ? "#28a745" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = isRepeat
              ? "#218838"
              : "#5a6268")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = isRepeat
              ? "#28a745"
              : "#6c757d")
          }
        >
          {isRepeat ? "Tắt lặp" : "Lặp lại"}
        </button>
        <button
          onClick={() => setIsShuffle(!isShuffle)}
          style={{
            padding: "8px 16px",
            backgroundColor: isShuffle ? "#28a745" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = isShuffle
              ? "#218838"
              : "#5a6268")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = isShuffle
              ? "#28a745"
              : "#6c757d")
          }
        >
          {isShuffle ? "Tắt xáo trộn" : "Xáo trộn"}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <label style={{ fontSize: "0.9em", color: "#333" }}>Âm lượng:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            style={{
              width: "100px",
              height: "8px",
              borderRadius: "4px",
              background: `linear-gradient(to right, #007bff ${volume}%, #ddd 0%)`,
              cursor: "pointer",
            }}
          />
          <span style={{ fontSize: "0.9em", color: "#666" }}>{volume}%</span>
        </div>
      </div>
    </div>
  );
};

export default Player;
