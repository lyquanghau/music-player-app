import React, { useState } from "react";
import Search from "./components/Search";
import Player from "./components/Player";
import CustomPlaylists from "./components/CustomPlaylists";
import Recommendations from "./components/Recommendations"; // Thêm Recommendations
import "./App.css";

const App = () => {
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentVideoInfo, setCurrentVideoInfo] = useState(null);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  // Chọn video từ Search hoặc Recommendations
  const handleSelectVideo = (videoId, index) => {
    console.log("Selecting video:", { videoId, index, videoList });
    if (index >= 0 && index < videoList.length) {
      setSelectedVideoId(videoId);
      setCurrentIndex(index);
      setCurrentVideoInfo(videoList[index]);
    } else {
      // Trường hợp chọn từ Recommendations (index = -1)
      const videoInfo = videoList.find((v) => v.id === videoId) || {
        id: videoId,
      };
      setSelectedVideoId(videoId);
      setCurrentIndex(-1); // Không thuộc danh sách hiện tại
      setCurrentVideoInfo(videoInfo);
    }
  };

  // Chuyển sang video tiếp theo
  const handleNext = () => {
    if (!videoList.length) return;

    if (isRepeat && currentIndex >= 0) {
      setSelectedVideoId(videoList[currentIndex].id); // Giữ nguyên video để Player phát lại
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
    console.log("Next video:", { nextIndex, video: videoList[nextIndex] });
  };

  // Quay lại video trước
  const handlePrevious = () => {
    if (!videoList.length) return;

    if (isRepeat && currentIndex >= 0) {
      setSelectedVideoId(videoList[currentIndex].id); // Giữ nguyên video để Player phát lại
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
    console.log("Previous video:", { prevIndex, video: videoList[prevIndex] });
  };

  // Phát từ playlist
  const playFromPlaylist = (videoId, index, playlistVideos) => {
    console.log("Playing from playlist:", { videoId, index, playlistVideos });
    if (!videoId || !playlistVideos || !Array.isArray(playlistVideos)) {
      console.error("Invalid playlist data:", {
        videoId,
        index,
        playlistVideos,
      });
      return;
    }

    const validVideos = playlistVideos.filter(
      (video) =>
        video.id &&
        video.title &&
        video.channel &&
        typeof video.thumbnail === "string"
    );

    if (validVideos.length === 0) {
      console.error("No valid videos in playlist:", playlistVideos);
      setSelectedVideoId(null);
      setCurrentIndex(-1);
      setCurrentVideoInfo(null);
      setVideoList([]);
      return;
    }

    if (index < 0 || index >= validVideos.length) {
      console.error("Invalid index:", index);
      return;
    }

    setSelectedVideoId(videoId);
    setCurrentIndex(index);
    setVideoList(validVideos);
    setCurrentVideoInfo(validVideos[index]);
    console.log("Updated state:", {
      selectedVideoId: videoId,
      currentIndex: index,
      videoList: validVideos,
      currentVideoInfo: validVideos[index],
    });
  };

  // Xử lý khi thêm video vào playlist
  const handleAddToPlaylist = (playlistId, updatedPlaylist) => {
    console.log("Playlist updated:", { playlistId, updatedPlaylist });
    // Có thể thêm logic để đồng bộ videoList nếu cần
  };

  return (
    <div className="app-container">
      <h1>Music Player App</h1>
      <div className="app-content">
        <div className="player-container">
          <Player
            videoId={selectedVideoId}
            videoInfo={currentVideoInfo}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={
              videoList.length > 0 &&
              (isRepeat || currentIndex < videoList.length - 1)
            }
            canGoPrevious={
              videoList.length > 0 && (isRepeat || currentIndex > 0)
            }
            isRepeat={isRepeat}
            setIsRepeat={setIsRepeat}
            isShuffle={isShuffle}
            setIsShuffle={setIsShuffle}
          />
          {/* Tích hợp Recommendations */}
          <Recommendations
            currentVideoId={selectedVideoId}
            onSelectVideo={handleSelectVideo}
          />
        </div>
        <div className="search-container">
          <Search
            onSelectVideo={handleSelectVideo}
            setVideoList={setVideoList}
            onAddToPlaylist={handleAddToPlaylist}
          />
          <CustomPlaylists
            onSelectVideo={handleSelectVideo}
            playFromPlaylist={playFromPlaylist}
            onAddToPlaylist={handleAddToPlaylist}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
