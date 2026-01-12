import { Play } from "lucide-react";
import "./ChannelsSection.css";
import useScrollReveal from "../../hooks/useScrollReveal";

const CHANNELS = [
  {
    id: "c1",
    name: "Sơn Tùng M-TP",
    followers: 1200000,
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "c2",
    name: "HIEUTHUHAI",
    followers: 540000,
    avatar: "https://i.pravatar.cc/150?img=22",
  },
  {
    id: "c3",
    name: "tlinh",
    followers: 430000,
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: "c4",
    name: "MONO",
    followers: 390000,
    avatar: "https://i.pravatar.cc/150?img=45",
  },
];

export default function ChannelsSection({ onOpen }) {
  /* Reveal cho header */
  const headerRef = useScrollReveal();

  /* Reveal cho list (stagger) */
  const listRef = useScrollReveal();

  return (
    <section id="channels" className="channels-section">
      {/* ================= HEADER ================= */}
      <div ref={headerRef} className="channels-header reveal">
        <h2>📺 Kênh nổi bật</h2>
        <p className="channels-desc">Nghệ sĩ và kênh âm nhạc được yêu thích</p>
      </div>

      {/* ================= LIST ================= */}
      <div ref={listRef} className="channels-list reveal-stagger">
        {CHANNELS.map((ch) => (
          <div
            key={ch.id}
            className="channel-card"
            onClick={() => onOpen?.(ch.id)}
          >
            {/* AVATAR */}
            <img src={ch.avatar} alt={ch.name} />

            {/* INFO */}
            <div className="channel-info">
              <strong>{ch.name}</strong>
              <span>{ch.followers.toLocaleString()} người theo dõi</span>
            </div>

            {/* PLAY */}
            <button
              className="channel-play"
              title="Phát kênh"
              onClick={(e) => {
                e.stopPropagation();
                onOpen?.(ch.id);
              }}
            >
              <Play size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
