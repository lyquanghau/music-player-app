import { Play, Music } from "lucide-react";
import "./HeroSection.css";

/* Mock data – sau này thay bằng API playlist */
const MOCK_PLAYLISTS = [
  {
    id: 1,
    title: "Chill Hits",
    desc: "Thư giãn & nhẹ nhàng",
  },
  {
    id: 2,
    title: "Đêm khuya",
    desc: "Sâu lắng & trầm",
  },
  {
    id: 3,
    title: "Acoustic",
    desc: "Mộc mạc & tinh tế",
  },
  {
    id: 4,
    title: "Tập trung",
    desc: "Làm việc hiệu quả",
  },
];

export default function HeroSection({ onStart }) {
  return (
    <section className="hero-mood">
      {/* ===== LEFT: MOOD CONTENT ===== */}
      <div className="hero-left">
        <span className="hero-tag">🎧 Playlist theo tâm trạng</span>

        <h1>
          Thư giãn cùng <span>Chill Vibes</span>
        </h1>

        <p>
          Những bản nhạc được chọn lọc giúp bạn thư giãn, tập trung hoặc tận
          hưởng những khoảnh khắc yên bình của riêng mình.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={onStart}>
            <Play size={18} />
            Nghe ngay
          </button>

          <button className="btn-outline">
            <Music size={18} />
            Xem playlist
          </button>
        </div>
      </div>

      {/* ===== RIGHT: PLAYLIST CARDS ===== */}
      <div className="hero-right">
        {MOCK_PLAYLISTS.map((playlist) => (
          <div key={playlist.id} className="playlist-card">
            <div className="playlist-cover">🎵</div>

            <div className="playlist-info">
              <h4>{playlist.title}</h4>
              <span>{playlist.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
