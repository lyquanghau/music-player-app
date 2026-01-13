import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
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

  const [repeatMode, setRepeatMode] = useState("all"); // all | one
  const [shuffle, setShuffle] = useState(false);

  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);

  /* ================= PLAYER INSTANCE ================= */
  const setPlayerInstance = (player) => {
    playerRef.current = player;
    player.setVolume(volume);
  };

  /* ================= PLAY TRACK ================= */
  const playTrack = useCallback((track, list = []) => {
    setCurrentTrack(track);
    setIsPlaying(true);

    if (list.length) {
      setQueue(list);
      const index = list.findIndex((t) => t.id === track.id);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, []);

  /* ================= TOGGLE PLAY ================= */
  const togglePlay = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying((p) => !p);
  };

  /* ================= SEEK ================= */
  const seekTo = (time) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(time, true);
    setCurrentTime(time);
  };

  /* ================= NEXT ================= */
  const playNext = () => {
    if (!queue.length) return;

    if (repeatMode === "one") {
      seekTo(0);
      playerRef.current.playVideo();
      return;
    }

    let nextIndex = shuffle
      ? Math.floor(Math.random() * queue.length)
      : (currentIndex + 1) % queue.length;

    setCurrentIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
    setIsPlaying(true);
  };

  /* ================= PREV ================= */
  const playPrev = () => {
    if (!queue.length) return;

    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;

    setCurrentIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
    setIsPlaying(true);
  };

  /* ================= VOLUME ================= */
  const changeVolume = (v) => {
    setVolume(v);
    if (playerRef.current) {
      playerRef.current.setVolume(v);
    }
    if (v > 0) setMuted(false);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
    } else {
      playerRef.current.mute();
    }
    setMuted((m) => !m);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        duration,
        currentTime,
        repeatMode,
        shuffle,
        volume,
        muted,

        playTrack,
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
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
