import { Play } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";
import "./HeroDiscoverGrid.css";

/* ================= HELPERS ================= */
const formatDuration = (seconds = 0) => {
  if (!seconds || isNaN(seconds)) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function HeroDiscoverGrid({
  tracks = [],
  searchResults = [],
  activeGenre = null,
  onResetGenre,
}) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const isPlayingTrack = (id) =>
    currentTrack && currentTrack.id === id && isPlaying;

  return (
    <section className="hero-discover">
      {/* ================= LEFT: TRENDING ================= */}
      <div className="hero-left">
        <div className="hero-header">
          <h2>
            🔥{" "}
            {activeGenre
              ? `Thịnh hành • ${activeGenre}`
              : "Những bài hát thịnh hành"}
          </h2>

          {activeGenre && (
            <button className="view-all" onClick={onResetGenre}>
              Quay về thịnh hành
            </button>
          )}
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

                  {t.duration && (
                    <span className="track-duration">
                      {formatDuration(t.duration)}
                    </span>
                  )}
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

      {/* ================= RIGHT: SEARCH ================= */}
      <div className="hero-right">
        {searchResults.length === 0 ? (
          <div className="hero-empty">
            <span>🔍</span>
            <p>Tìm kiếm bài hát, nghệ sĩ hoặc playlist</p>
          </div>
        ) : (
          <div className="hero-search-list">
            {searchResults.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className={`hero-search-item ${
                  isPlayingTrack(item.id) ? "playing" : ""
                }`}
                onClick={() => playTrack(item, searchResults)}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="hero-search-thumb"
                />

                <div className="hero-search-info">
                  <div className="hero-search-title">{item.title}</div>
                  <div className="hero-search-channel">
                    {item.channel}
                    {item.duration && (
                      <span> | {formatDuration(item.duration)}</span>
                    )}
                  </div>
                </div>

                {isPlayingTrack(item.id) && (
                  <span className="hero-search-playing">▶</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
