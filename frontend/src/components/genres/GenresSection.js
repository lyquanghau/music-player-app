import "./GenresSection.css";
import useScrollReveal from "../../hooks/useScrollReveal";

const GENRES = [
  { id: 1, title: "Pop", desc: "Nhạc phổ biến", icon: "🎤", color: "pink" },
  {
    id: 2,
    title: "Ballad",
    desc: "Nhẹ nhàng, cảm xúc",
    icon: "🎻",
    color: "blue",
  },
  {
    id: 3,
    title: "Rap Việt",
    desc: "Cá tính, hiện đại",
    icon: "🎧",
    color: "green",
  },
  {
    id: 4,
    title: "EDM",
    desc: "Sôi động, năng lượng",
    icon: "⚡",
    color: "yellow",
  },
  {
    id: 5,
    title: "Acoustic",
    desc: "Mộc mạc, tinh tế",
    icon: "🎸",
    color: "purple",
  },
  {
    id: 6,
    title: "Chill",
    desc: "Thư giãn, dễ nghe",
    icon: "☁️",
    color: "cyan",
  },
  { id: 7, title: "Rock", desc: "Mạnh mẽ, cổ điển", icon: "🤘", color: "red" },
  {
    id: 8,
    title: "Nhạc Trẻ",
    desc: "Xu hướng hiện nay",
    icon: "🔥",
    color: "violet",
  },
  {
    id: 9,
    title: "Bolero",
    desc: "Da diết, trữ tình",
    icon: "💃",
    color: "amber",
  },
];

export default function GenresSection({ onSelectGenre }) {
  const headerRef = useScrollReveal();

  const rowTop = GENRES.slice(0, 5);
  const rowBottom = GENRES.slice(5);

  return (
    <section id="genres" className="genres-section">
      {/* HEADER */}
      <div ref={headerRef} className="genres-header reveal">
        <h2>🎼 Thể loại</h2>
        <p>Khám phá âm nhạc theo phong cách bạn yêu thích</p>
      </div>

      {/* MARQUEE */}
      <div className="genres-marquee">
        {/* TOP ROW (→ LEFT) */}
        <div className="marquee marquee-left">
          {[...rowTop, ...rowTop].map((g, i) => (
            <GenreCard
              key={`top-${i}`}
              genre={g}
              onSelectGenre={onSelectGenre}
            />
          ))}
        </div>

        {/* BOTTOM ROW (→ RIGHT) */}
        <div className="marquee marquee-right">
          {[...rowBottom, ...rowBottom].map((g, i) => (
            <GenreCard
              key={`bottom-${i}`}
              genre={g}
              onSelectGenre={onSelectGenre}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GenreCard({ genre, onSelectGenre }) {
  return (
    <div
      className={`genre-card ${genre.color}`}
      onClick={() => onSelectGenre?.(genre.title)}
    >
      {/* 🎧 SOUND WAVE */}
      <div className="genre-eq">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="genre-bg-icon">{genre.icon}</div>

      <div className="genre-content">
        <h3>{genre.title}</h3>
        <span>{genre.desc}</span>
      </div>
    </div>
  );
}
