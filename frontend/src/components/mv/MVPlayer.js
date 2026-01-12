// components/mv/MVPlayer.js
export default function MVPlayer({ mv }) {
  if (!mv) return null;

  return (
    <div className="mv-player">
      <div className="mv-video">
        <iframe
          src={mv.videoUrl}
          title={mv.title}
          frameBorder="0"
          allowFullScreen
        />
      </div>

      <h3>{mv.title}</h3>
      <p className="mv-meta">
        {mv.artist} • {mv.views.toLocaleString()} lượt xem
      </p>
    </div>
  );
}
