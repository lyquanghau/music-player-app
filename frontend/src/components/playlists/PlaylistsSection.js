// src/components/playlists/PlaylistsSection.js
import { Play } from "lucide-react";
import "./PlaylistsSection.css";
import useScrollReveal from "../../hooks/useScrollReveal";

/* ================= HELPERS ================= */
const getPlaylistThumbnail = (playlist) => {
  if (!playlist?.videos?.length) return null;
  return `https://i.ytimg.com/vi/${playlist.videos[0]}/hqdefault.jpg`;
};

/* ================= COMPONENT ================= */
export default function PlaylistsSection({
  playlists = [],
  onOpen, // (playlist)
  onPlay, // (playlist)
}) {
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal();

  return (
    <section id="playlists" className="playlists-section">
      {/* HEADER */}
      <div ref={headerRef} className="playlists-header reveal">
        <h2>🎵 Danh sách phát</h2>
        <p className="playlists-desc">
          Playlist do bạn tạo và những playlist nổi bật
        </p>
      </div>

      {/* CONTENT */}
      {playlists.length === 0 ? (
        <div className="playlist-empty reveal">
          Chưa có playlist nào. Hãy tạo playlist đầu tiên 🎶
        </div>
      ) : (
        <div ref={gridRef} className="playlists-grid reveal-stagger">
          {playlists.map((playlist) => {
            const thumbnail = getPlaylistThumbnail(playlist);

            return (
              <div
                key={playlist.id}
                className="playlist-card"
                onClick={() => onOpen?.(playlist)}
              >
                {/* COVER */}
                <div className="playlist-cover">
                  {thumbnail ? <img src={thumbnail} alt="" /> : <span>🎵</span>}
                </div>

                {/* INFO */}
                <div className="playlist-info">
                  <h4>{playlist.name}</h4>
                  <span>{playlist.videos.length} bài hát</span>
                </div>

                {/* PLAY */}
                <button
                  className="playlist-play"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay?.(playlist);
                  }}
                  title="Phát playlist"
                >
                  <Play size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
