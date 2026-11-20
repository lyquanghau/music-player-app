import YouTube from "react-youtube";
import { usePlayer } from "../context/PlayerContext";

export default function PlayerPage() {
  const {
    currentTrack,
    setPlayerInstance,
    finishTrack,
    isMVMode,
    setIsPlaying,
    volume,
    muted,
    setDuration,
  } = usePlayer();

  if (!currentTrack || isMVMode) return null;

  return (
    <YouTube
      videoId={currentTrack.id}
      opts={{
        height: "0",
        width: "0",
        playerVars: { autoplay: 1 },
      }}
      onReady={({ target }) => {
        setPlayerInstance(target);
        target.setVolume(volume);
        if (muted) target.mute();
      }}
      onStateChange={(e) => {
        if (e.data === 0) finishTrack();
      }}
      onPlay={(e) => {
        setDuration(e.target.getDuration());
        setIsPlaying(true);
      }}
      onPause={() => setIsPlaying(false)}
      onError={() => {
        setIsPlaying(false);
        window.alert("Không thể phát bài này. Hãy chọn bài khác.");
      }}
    />
  );
}
