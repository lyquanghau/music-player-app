// components/mv/MVSection.js
import { useState } from "react";
import MVPlayer from "./MVPlayer";
import MVRecommendations from "./MVRecommendations";
import "./MVSection.css";

const MOCK_MVS = [
  {
    id: "1",
    title: "Chúng Ta Của Hiện Tại",
    artist: "Sơn Tùng M-TP",
    views: 120000000,
    videoUrl: "https://www.youtube.com/embed/6t-MjBazs3o",
    thumbnail: "https://i.ytimg.com/vi/6t-MjBazs3o/hqdefault.jpg",
  },
  {
    id: "2",
    title: "Ngủ Một Mình",
    artist: "HIEUTHUHAI",
    views: 42000000,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  },
];

export default function MVSection() {
  const [currentMV, setCurrentMV] = useState(MOCK_MVS[0]);

  return (
    <section id="mv" className="mv-wrapper">
      <h2>🎬 Video âm nhạc</h2>

      <div className="mv-section">
        <MVPlayer mv={currentMV} />

        <MVRecommendations
          videos={MOCK_MVS}
          currentId={currentMV.id}
          onSelect={setCurrentMV}
        />
      </div>
    </section>
  );
}
