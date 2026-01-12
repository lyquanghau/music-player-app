// components/mv/MVRecommendations.js
export default function MVRecommendations({ videos, currentId, onSelect }) {
  return (
    <div className="mv-recommend">
      <h4>Video đề xuất</h4>

      <div className="mv-list">
        {videos
          .filter((v) => v.id !== currentId)
          .map((v) => (
            <div key={v.id} className="mv-item" onClick={() => onSelect(v)}>
              <img src={v.thumbnail} alt={v.title} />
              <div>
                <strong>{v.title}</strong>
                <span>{v.artist}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
