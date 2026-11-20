import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "../AuthContext";

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const { user } = useAuth();
  const likesKey = `likedTracks:${user?.id || "guest"}`;
  /* ================= REFS ================= */
  const playerRef = useRef(null);

  /* ================= CORE STATE ================= */
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  /* ================= TIME ================= */
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  /* ================= MODES ================= */
  const [repeatMode, setRepeatMode] = useState("off"); // off | all | one
  const [shuffle, setShuffle] = useState(false);

  /* ================= VOLUME ================= */
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);

  /* ================= LIKE ================= */
  const [likedTracks, setLikedTracks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(likesKey)) || [];
    } catch {
      return [];
    }
  });

  /* ================= MV ================= */
  const [showMV, setShowMV] = useState(false);
  const [isMVMode, setIsMVMode] = useState(false);

  /* ================= PLAYER TIME UPDATE ================= */
  useEffect(() => {
    if (!isPlaying || isMVMode) return;

    const interval = setInterval(() => {
      const time = playerRef.current?.getCurrentTime?.();
      const dur = playerRef.current?.getDuration?.();

      if (typeof time === "number") setCurrentTime(time);
      if (typeof dur === "number" && dur !== duration) setDuration(dur);
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, duration, isMVMode]);

  /* ================= PLAYER INSTANCE ================= */
  const setPlayerInstance = useCallback((player) => {
    playerRef.current = player;
  }, []);

  /* ================= PLAY SINGLE TRACK ================= */
  const playTrack = useCallback((track, list = []) => {
    if (!track) return;

    setCurrentTrack(track);
    setIsPlaying(true);

    if (Array.isArray(list) && list.some(item => item.id === track.id)) {
      setQueue(list);
      const index = list.findIndex((t) => t.id === track.id);
      setCurrentIndex(index >= 0 ? index : 0);
    } else {
      setQueue([track]);
      setCurrentIndex(0);
    }
  }, []);

  /* ================= TOGGLE PLAY ================= */
  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  /* ================= SEEK ================= */
  const seekTo = useCallback((time) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(time, true);
    setCurrentTime(time);
  }, []);

  /* ================= NEXT ================= */
  const playNext = useCallback(() => {
    if (!queue.length) return;

    if (repeatMode === "one") {
      seekTo(0);
      playerRef.current?.playVideo();
      return;
    }

    let nextIndex;
    if (shuffle) {
      nextIndex = (currentIndex + 1 + Math.floor(Math.random() * Math.max(1, queue.length - 1))) % queue.length;
    } else {
      nextIndex =
        currentIndex < queue.length - 1 ? currentIndex + 1 : 0;
    }

    setCurrentIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
    setIsPlaying(true);
  }, [queue, currentIndex, shuffle, repeatMode, seekTo]);

  /* ================= PREVIOUS ================= */
  const playPrev = useCallback(() => {
    if (!queue.length) return;

    const prevIndex =
      currentIndex === 0 ? queue.length - 1 : currentIndex - 1;

    setCurrentIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
    setIsPlaying(true);
  }, [queue, currentIndex]);

  /* ================= PLAY PLAYLIST ================= */
  const playPlaylist = useCallback((tracks, startIndex = 0) => {
    if (!Array.isArray(tracks) || tracks.length === 0) return;

    setQueue(tracks);
    setCurrentIndex(startIndex);
    setCurrentTrack(tracks[startIndex]);
    setIsPlaying(true);
  }, []);

  /* ================= SELECT TRACK IN QUEUE ================= */
  const selectTrack = useCallback(
    (index) => {
      if (!queue.length || index < 0 || index >= queue.length) return;
      setCurrentIndex(index);
      setCurrentTrack(queue[index]);
      setIsPlaying(true);
    },
    [queue]
  );

  /* ================= VOLUME ================= */
  const changeVolume = useCallback((v) => {
    setVolume(v);
    playerRef.current?.setVolume(v);
  }, []);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;

    if (muted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setMuted((m) => !m);
  }, [muted]);

  /* ================= LIKE ================= */
  const toggleLike = useCallback((trackId) => {
    setLikedTracks((prev) => {
      const next = prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId];

      localStorage.setItem(likesKey, JSON.stringify(next));
      return next;
    });
  }, [likesKey]);

  const finishTrack = () => {
    if (repeatMode === "off" && !shuffle && currentIndex === queue.length - 1) {
      setIsPlaying(false);
      return;
    }
    playNext();
  };

  /* ================= PROVIDER ================= */
  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        currentIndex,
        isPlaying,
        duration,
        setDuration,
        finishTrack,
        currentTime,
        repeatMode,
        shuffle,
        volume,
        muted,

        playTrack,
        playPlaylist,
        selectTrack,

        togglePlay,
        playNext,
        playPrev,
        seekTo,

        setRepeatMode,
        setShuffle,
        setPlayerInstance,
        changeVolume,
        toggleMute,

        toggleLike,
        isLiked: (id) => likedTracks.includes(id),

        setIsPlaying,
        showMV,
        setShowMV,
        isMVMode,
        setIsMVMode,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return ctx;
};
