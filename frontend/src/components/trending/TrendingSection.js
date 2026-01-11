// components/trending/TrendingSection.js
import { Play } from "lucide-react";
import "./TrendingSection.css";

const TRENDING_SONGS = [
  {
    id: 1,
    title: "Chúng Ta Của Hiện Tại",
    artist: "Sơn Tùng M-TP",
    score: 92,
    change: 12,
  },
  {
    id: 2,
    title: "Ngủ Một Mình",
    artist: "HIEUTHUHAI",
    score: 78,
    change: -3,
  },
  {
    id: 3,
    title: "Ghệ Iu Dấu",
    artist: "tlinh",
    score: 65,
    change: 8,
  },
  {
    id: 4,
    title: "Em Là",
    artist: "MONO",
    score: 58,
    change: 4,
  },
];

export default function TrendingSection({ onPlay }) {
  return (
    <section id="trending" className="trending-section">
      <h2>🔥 Xu hướng hôm nay</h2>
      <p className="trending-desc">
        Những bài hát được nghe nhiều nhất hiện tại
      </p>

      <div className="trending-list">
        {TRENDING_SONGS.map((song, index) => (
          <div key={song.id} className="trending-item">
            <div className="rank">#{index + 1}</div>

            <div className="song-info">
              <strong>{song.title}</strong>
              <span>{song.artist}</span>

              <div className="bar">
                <div className="bar-fill" style={{ width: `${song.score}%` }} />
              </div>
            </div>

            <div className={`change ${song.change >= 0 ? "up" : "down"}`}>
              {song.change >= 0
                ? `↑ +${song.change}%`
                : `↓ ${Math.abs(song.change)}%`}
            </div>

            <button
              className="play-btn"
              onClick={() => onPlay?.(song.id)}
              title="Nghe ngay"
            >
              <Play size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
