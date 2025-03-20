import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import Player from "./components/Player";

const App = () => {
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentVideoInfo, setCurrentVideoInfo] = useState(null);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [playlist, setPlaylist] = useState([]); // Danh sách phát

  // Khởi tạo danh sách phát từ localStorage
  useEffect(() => {
    const savedPlaylist = localStorage.getItem("playlist");
    if (savedPlaylist) {
      setPlaylist(JSON.parse(savedPlaylist));
    }
  }, []);

  // Lưu danh sách phát vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("playlist", JSON.stringify(playlist));
  }, [playlist]);

  const handleSelectVideo = (videoId, index) => {
    setSelectedVideoId(videoId);
    setCurrentIndex(index);
    setCurrentVideoInfo(videoList[index]);
  };

  const handleNext = () => {
    if (isRepeat) {
      setSelectedVideoId(videoList[currentIndex].id);
      setCurrentVideoInfo(videoList[currentIndex]);
      return;
    }

    let nextIndex;
    if (isShuffle) {
      do {
        nextIndex = Math.floor(Math.random() * videoList.length);
      } while (nextIndex === currentIndex && videoList.length > 1);
    } else {
      nextIndex = currentIndex < videoList.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedVideoId(videoList[nextIndex].id);
    setCurrentIndex(nextIndex);
    setCurrentVideoInfo(videoList[nextIndex]);
  };

  const handlePrevious = () => {
    if (isRepeat) {
      setSelectedVideoId(videoList[currentIndex].id);
      setCurrentVideoInfo(videoList[currentIndex]);
      return;
    }

    let prevIndex;
    if (isShuffle) {
      do {
        prevIndex = Math.floor(Math.random() * videoList.length);
      } while (prevIndex === currentIndex && videoList.length > 1);
    } else {
      prevIndex = currentIndex > 0 ? currentIndex - 1 : videoList.length - 1;
    }

    setSelectedVideoId(videoList[prevIndex].id);
    setCurrentIndex(prevIndex);
    setCurrentVideoInfo(videoList[prevIndex]);
  };

  const addToPlaylist = (video) => {
    if (!playlist.some((item) => item.id === video.id)) {
      setPlaylist([...playlist, video]);
    }
  };

  const removeFromPlaylist = (videoId) => {
    setPlaylist(playlist.filter((item) => item.id !== videoId));
  };

  const playFromPlaylist = (videoId, index) => {
    setSelectedVideoId(videoId);
    setCurrentIndex(index);
    setCurrentVideoInfo(playlist[index]);
    setVideoList(playlist); // Chuyển danh sách phát thành danh sách hiện tại
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1>Music Player App</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          "@media (min-width: 768px)": {
            flexDirection: "row",
            alignItems: "flex-start",
          },
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "640px",
            "@media (min-width: 768px)": {
              width: "50%",
            },
          }}
        >
          <Player
            videoId={selectedVideoId}
            videoInfo={currentVideoInfo}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={currentIndex < videoList.length - 1}
            canGoPrevious={currentIndex > 0}
            isRepeat={isRepeat}
            setIsRepeat={setIsRepeat}
            isShuffle={isShuffle}
            setIsShuffle={setIsShuffle}
          />
        </div>
        <div
          style={{
            width: "100%",
            "@media (min-width: 768px)": {
              width: "50%",
            },
          }}
        >
          <Search
            onSelectVideo={handleSelectVideo}
            setVideoList={setVideoList}
            addToPlaylist={addToPlaylist}
          />
          {playlist.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3>Danh sách phát</h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {playlist.map((item, index) => (
                  <li
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                      backgroundColor: "#f9f9f9",
                      transition: "background-color 0.2s",
                    }}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{ width: "50px", borderRadius: "4px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold" }}>{item.title}</div>
                      <div style={{ color: "#666", fontSize: "14px" }}>
                        {item.channel}
                      </div>
                    </div>
                    <button
                      onClick={() => playFromPlaylist(item.id, index)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Phát
                    </button>
                    <button
                      onClick={() => removeFromPlaylist(item.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
