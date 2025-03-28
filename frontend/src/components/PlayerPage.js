import React from "react";
import { useParams } from "react-router-dom";
import Player from "./Player";
import { useAuth } from "../AuthContext"; // Đúng đường dẫn

const PlayerPage = () => {
  const { videoId } = useParams();
  const { user } = useAuth();

  if (!user) return <div>Vui lòng đăng nhập để phát nhạc</div>;

  return (
    <div>
      <h1>Đang phát</h1>
      <Player
        videoId={videoId}
        videoInfo={{ id: videoId }}
        onNext={() => {}}
        onPrevious={() => {}}
        canGoNext={false}
        canGoPrevious={false}
        isRepeat={false}
        setIsRepeat={() => {}}
        isShuffle={false}
        setIsShuffle={() => {}}
      />
    </div>
  );
};

export default PlayerPage;
