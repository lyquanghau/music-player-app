import { Play } from "lucide-react";
import "./PlaylistsSection.css";
import useScrollReveal from "../../hooks/useScrollReveal";

export default function PlaylistsSection({ playlists = [], onOpen, onPlay }) {
  /* Reveal cho header */
  const headerRef = useScrollReveal();

  /* Reveal cho grid (stagger) */
  const gridRef = useScrollReveal();

  return (
    <section id="playlists" className="playlists-section">
      {/* ================= HEADER ================= */}
      <div ref={headerRef} className="playlists-header reveal">
        <h2>🎵 Danh sách phát</h2>
        <p className="playlists-desc">
          Playlist do bạn tạo và những playlist nổi bật
        </p>
      </div>

      {/* ================= CONTENT ================= */}
      {playlists.length === 0 ? (
        <div className="playlist-empty reveal">Chưa có playlist nào</div>
      ) : (
        <div ref={gridRef} className="playlists-grid reveal-stagger">
          {playlists.map((pl) => (
            <div
              key={pl._id}
              className="playlist-card"
              onClick={() => onOpen?.(pl._id)}
            >
              {/* ===== COVER ===== */}
              <div className="playlist-cover">
                {pl.thumbnail ? (
                  <img src={pl.thumbnail} alt={pl.name} />
                ) : (
                  <span>🎵</span>
                )}
              </div>

              {/* ===== INFO ===== */}
              <div className="playlist-info">
                <h4>{pl.name}</h4>
                <span>{pl.videos.length} bài hát</span>
              </div>

              {/* ===== PLAY BUTTON ===== */}
              <button
                className="playlist-play"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay?.(pl._id);
                }}
                title="Phát playlist"
              >
                <Play size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
