import React, { useState } from "react";
import Search from "./components/Search";
import Player from "./components/Player";
import CustomPlaylists from "./components/CustomPlaylists";
import "./App.css";

const App = () => {
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentVideoInfo, setCurrentVideoInfo] = useState(null);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const handleSelectVideo = (videoId, index) => {
    console.log("Selecting video:", { videoId, index, videoList });
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
    console.log("Next video:", { nextIndex, videoList: videoList[nextIndex] });
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
    console.log("Previous video:", {
      prevIndex,
      videoList: videoList[prevIndex],
    });
  };

  const playFromPlaylist = (videoId, index, playlistVideos) => {
    console.log("Playing from playlist:", { videoId, index, playlistVideos });
    if (!videoId || !playlistVideos || !Array.isArray(playlistVideos)) {
      console.error("Dữ liệu không hợp lệ:", {
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
      console.error("Không có video hợp lệ trong playlist:", playlistVideos);
      return;
    }

    if (index < 0 || index >= validVideos.length) {
      console.error("Index không hợp lệ:", index);
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

  const handleAddToPlaylist = (playlistId, updatedPlaylist) => {
    console.log("Playlist updated:", { playlistId, updatedPlaylist });
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
              currentIndex < videoList.length - 1 && videoList.length > 0
            }
            canGoPrevious={currentIndex > 0 && videoList.length > 0}
            isRepeat={isRepeat}
            setIsRepeat={setIsRepeat}
            isShuffle={isShuffle}
            setIsShuffle={setIsShuffle}
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
