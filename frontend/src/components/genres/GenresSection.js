import "./GenresSection.css";

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
];

export default function GenresSection() {
  return (
    <section id="genres" className="genres-section">
      <div className="genres-header">
        <h2>🎼 Thể loại</h2>
      </div>

      <div className="genres-grid">
        {GENRES.map((g) => (
          <div key={g.id} className={`genre-card ${g.color}`}>
            <div className="genre-bg-icon">{g.icon}</div>
            <div className="genre-content">
              <h3>{g.title}</h3>
              <span>{g.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
