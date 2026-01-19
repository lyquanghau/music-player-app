import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const playerRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [repeatMode, setRepeatMode] = useState("off"); // off | all | one
  const [shuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [likedTracks, setLikedTracks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("likedTracks")) || [];
    } catch {
      return [];
    }
  });

  const [showMV, setShowMV] = useState(false);
  const [isMVMode, setIsMVMode] = useState(false);

  // QUAN TRỌNG: Cập nhật thời gian thực từ Player
  useEffect(() => {
    let interval;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        // Lấy thời gian hiện tại từ YouTube Player API
        const time = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration();

        if (time !== undefined) setCurrentTime(time);
        if (dur !== undefined && dur !== duration) setDuration(dur);
      }, 500); // Cập nhật mỗi 0.5 giây để mượt mà
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const setPlayerInstance = (player) => {
    playerRef.current = player;
  };

  const playTrack = useCallback((track, list = []) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (list.length) {
      setQueue(list);
      setCurrentIndex(list.findIndex((t) => t.id === track.id) || 0);
    }
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const seekTo = (time) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(time, true);
    setCurrentTime(time);
  };

  const playNext = useCallback(() => {
    if (!queue.length) return;
    if (repeatMode === "one") {
      seekTo(0);
      playerRef.current?.playVideo();
      return;
    }
    let nextIndex = shuffle
      ? Math.floor(Math.random() * queue.length)
      : (currentIndex + 1) % queue.length;

    setCurrentIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
    setIsPlaying(true);
  }, [queue, currentIndex, shuffle, repeatMode]);

  const playPrev = () => {
    if (!queue.length) return;
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
    setIsPlaying(true);
  };

  const changeVolume = (v) => {
    setVolume(v);
    if (playerRef.current) playerRef.current.setVolume(v);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setMuted(!muted);
  };

  const toggleLike = (trackId) => {
    setLikedTracks((prev) => {
      const next = prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId];
      localStorage.setItem("likedTracks", JSON.stringify(next));
      return next;
    });
  };

  const playPlayList = useCallback((tracks, startIndex = 0) => {
    if (!Array.isArray(tracks) || tracks.length === 0) return;

    setQueue(tracks);
    setCurrentIndex(startIndex);
    setCurrentTrack(tracks[startIndex]);
    setIsPlaying(true);
  });

  const selecteTrack = useCallback((index) => {
    if (!queue.length || index < 0 || index >= queue.length) return;
    setCurrentIndex(index);
    setCurrentTrack(queue[index]);
    setIsPlaying(true);
  });

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        currentIndex,
        isPlaying,
        duration,
        currentTime,
        repeatMode,
        shuffle,
        volume,
        muted,
        playTrack,
        playPlayList,
        selecteTrack,
        togglePlay,
        playNext,
        playPrev,
        seekTo,
        setDuration,
        setCurrentTime,
        setRepeatMode,
        setShuffle,
        setPlayerInstance,
        changeVolume,
        toggleMute,
        toggleLike,
        isLiked: (id) => likedTracks.includes(id),
        setIsPlaying,
        setShowMV,
        showMV,
        isMVMode,
        setIsMVMode,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
