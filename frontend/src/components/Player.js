import React, { useState, useRef } from "react";
import ReactPlayer from "react-player/youtube"; // thư viện hỗ trợ phát video Youtube
import { MdOutlineVolumeUp } from "react-icons/md";
import { LuRepeat1 } from "react-icons/lu";
import { FaRandom } from "react-icons/fa";
import {
  GiPreviousButton,
  GiNextButton,
  GiPauseButton,
  GiPlayButton,
} from "react-icons/gi";

// Component Player nhận các props sau:\
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
  // Trạng thái quản lý phát video
  const [isPlaying, setIsPlaying] = useState(true); // true: đang phát, false: tạm dừng
  const [played, setPlayed] = useState(0); // tiến trình phát video (0-1)
  const [duration, setDuration] = useState(0); // thời lượng video (giây)
  const [volume, setVolume] = useState(0.84); // âm lượng (0-1)

  // Trạng thái mới: quản lý loading và lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const playerRef = useRef(null);

  // Xử lý khi video kết thúc
  const onEnded = () => {
    console.log("Video ended, checking repeat or next");
    if (isRepeat) {
      setIsPlaying(true); // Phát lại video
    } else {
      onNext(); // Chuyển sang video tiếp theo
    }
  };

  // Chuyển đổi trạng thái play/pause
  const togglePlay = () => {
    console.log("Toggling play, isPlaying:", isPlaying);
    setIsPlaying(!isPlaying); // Đảo ngược trạng thái play/pause
  };

  // Cập nhật tiến trình phát video
  const handleProgress = (state) => {
    setPlayed(state.played);
    console.log(
      "Progress:",
      state.playedSeconds,
      "Duration:",
      state.loadedSeconds
    );
  };

  // Lấy thời lượng video
  const handleDuration = (duration) => {
    setDuration(duration); // Lưu thời lượng video
    console.log("Duration set:", duration);
  };

  // Xử lý khi người dùng kéo thanh seek bar
  const handleSeekChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setPlayed(newValue);
    playerRef.current.seekTo(newValue, "fraction");
  };

  // Định dạng thời gian (phút:giây)
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
      {/* Hiển thị tiêu đề và kênh của video */}
      <h2 style={{ fontSize: "1.5em", marginBottom: "10px", color: "#ADD8E6" }}>
        {videoInfo?.title || "Chưa chọn video"}
      </h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        {videoInfo?.channel || ""}
      </p>

      {/* Hiển thị thông báo lỗi hoặc trạng thái tải nếu có */}
      {error && (
        <p style={{ color: "#dc3545", marginBottom: "10px" }}>{error}</p>
      )}
      {isLoading && (
        <p style={{ color: "#666", marginBottom: "10px" }}>Đang tải video...</p>
      )}

      {/* Hiển thị ReactPlayer nếu có videoId, nếu không thì thông báo */}
      {videoId ? (
        <>
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${videoId}`}
            playing={isPlaying}
            volume={volume}
            onEnded={onEnded}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onBuffer={() => setIsLoading(true)} // Khi video bắt đầu buffer
            onBufferEnd={() => setIsLoading(false)} // Khi video buffer xong
            onError={(e) => {
              console.error("ReactPlayer error:", e);
              setError("Có lỗi xảy ra khi phát nhạc!");
            }} // Xử lý lỗi
            width="0"
            height="0"
            config={{
              youtube: {
                playerVars: { controls: 0, showinfo: 0 },
              },
            }}
          />

          {/* Thanh seek bar hiển thị tiến trình phát */}
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
              style={{ flex: 1, cursor: "pointer" }}
            />
            <span>{formatTime(duration)}</span>
          </div>

          {/* Thanh điều chỉnh âm lượng */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <span>
              <MdOutlineVolumeUp />
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{ width: "100px", cursor: "pointer" }}
            />
            <span>{Math.round(volume * 100)}%</span>
          </div>
        </>
      ) : (
        <p style={{ color: "#666" }}>Vui lòng chọn một video để phát</p>
      )}

      {/* Các nút điều khiển */}
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
          <GiPreviousButton />
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
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isPlaying ? <GiPauseButton /> : <GiPlayButton />}
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
          <GiNextButton />
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
          {isRepeat ? <LuRepeat1 /> : <LuRepeat1 />}
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
          {isShuffle ? <FaRandom /> : <FaRandom />}
        </button>
      </div>
    </div>
  );
};

export default Player;
