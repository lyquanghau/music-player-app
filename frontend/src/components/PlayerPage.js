import YouTube from "react-youtube";
import { usePlayer } from "../context/PlayerContext";

export default function PlayerPage() {
  const {
    currentTrack,
    setPlayerInstance,
    playNext,
    setDuration,
    setCurrentTime,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <YouTube
      videoId={currentTrack.id}
      opts={{
        height: "0",
        width: "0",
        playerVars: { autoplay: 1 },
      }}
      onReady={(e) => setPlayerInstance(e.target)}
      onStateChange={(e) => {
        if (e.data === 0) playNext();
      }}
      onPlay={(e) => {
        setDuration(e.target.getDuration());
      }}
      onError={() => playNext()}
      onPlaybackQualityChange={() => {}}
      onPlaybackRateChange={() => {}}
      onProgress={(e) => {
        setCurrentTime(e.target.getCurrentTime());
      }}
    />
  );
}
