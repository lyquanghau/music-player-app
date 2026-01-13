import { Play } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";
import "./HeroDiscoverGrid.css";

export default function HeroDiscoverGrid({ tracks = [] }) {
  const { playTrack } = usePlayer();

  return (
    <section id="hero" className="hero-discover">
      <div className="hero-left">
        <div className="hero-header">
          <h2>🔥 Những bài hát thịnh hành</h2>
          <button className="view-all">Hiện tất cả</button>
        </div>

        {tracks.length === 0 ? (
          <div className="hero-loading">Chưa có gợi ý</div>
        ) : (
          <div className="tracks-grid">
            {tracks.slice(0, 8).map((t) => (
              <div
                key={t.id}
                className="track-card"
                onClick={() => playTrack(t, tracks)}
              >
                <div className="track-cover">
                  {t.thumbnail ? (
                    <img src={t.thumbnail} alt={t.title} />
                  ) : (
                    <div className="track-placeholder">🎵</div>
                  )}

                  <button
                    className="track-play"
                    onClick={(e) => {
                      e.stopPropagation();
                      playTrack(t, tracks);
                    }}
                  >
                    <Play size={16} />
                  </button>
                </div>

                <div className="track-meta">
                  <div className="track-title" title={t.title}>
                    {t.title}
                  </div>
                  <div className="track-artist" title={t.channel}>
                    {t.channel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hero-right">
        <div className="hero-empty">
          <span>🔍</span>
          <p>Tìm kiếm bài hát, nghệ sĩ hoặc playlist</p>
        </div>
      </div>
    </section>
  );
}
