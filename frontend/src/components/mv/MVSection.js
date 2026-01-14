import { useEffect, useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import api from "../../api/api";
import "./MVSection.css";

export default function MVSection() {
  const { currentTrack, showMV, setShowMV, setIsMVMode, playTrack } =
    usePlayer();

  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch video đề xuất
  useEffect(() => {
    if (!showMV || !currentTrack) return;

    const fetchSuggested = async () => {
      setLoading(true);
      try {
        const q = `${currentTrack.title} ${currentTrack.channel}`;
        const res = await api.get("/search", { params: { q } });

        const items =
          res.data?.items?.filter((v) => v.id !== currentTrack.id) || [];

        setSuggested(items.slice(0, 6));
      } catch (err) {
        console.error("Fetch MV suggestions error", err);
        setSuggested([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggested();
  }, [currentTrack, showMV]);

  if (!showMV || !currentTrack) return null;

  return (
    <section id="mv" className="mv-wrapper">
      <div className="mv-card">
        {/* ===== HEADER ===== */}
        <div
          className="mv-header"
          onClick={() => {
            setShowMV(false);
            setIsMVMode(false);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          ← Quay lại nghe nhạc
        </div>

        {/* ===== CONTENT ===== */}
        <div className="mv-content">
          {/* ===== LEFT: VIDEO ===== */}
          <div className="mv-video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${currentTrack.id}?autoplay=1`}
              title={currentTrack.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>

          {/* ===== RIGHT: RECOMMEND ===== */}
          <div className="mv-recommend">
            {loading && <div className="mv-loading">Đang tải...</div>}

            {!loading &&
              suggested.map((v) => (
                <div
                  key={v.id}
                  className="mv-recommend-item"
                  onClick={() => playTrack(v, suggested)}
                >
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="mv-recommend-thumb"
                  />

                  <div className="mv-recommend-info">
                    <div className="mv-recommend-title">{v.title}</div>
                    <div className="mv-recommend-channel">
                      {v.channel}
                      {v.duration && (
                        <span>
                          {" "}
                          · {Math.floor(v.duration / 60)}:
                          {(v.duration % 60).toString().padStart(2, "0")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
