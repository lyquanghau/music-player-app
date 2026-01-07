import React from "react";
import { IoAdd } from "react-icons/io5";
import "../assets/css/SearchResults.css";

const SearchResults = ({ videoList, onSelectVideo, onAddToPlaylist }) => {
  if (!videoList || videoList.length === 0) return null;

  return (
    <div className="search-results">
      <h3 className="search-results-title">Kết quả tìm kiếm</h3>

      <div className="search-results-list">
        {videoList.map((item, index) => (
          <div
            key={item.id}
            className="search-result-card"
            onClick={() => onSelectVideo(item.id, index)}
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="search-result-thumb"
              loading="lazy"
            />

            <div className="search-result-info">
              <div className="search-result-title">{item.title}</div>
              <div className="search-result-channel">{item.channel}</div>
            </div>

            <button
              className="search-result-add"
              onClick={(e) => {
                e.stopPropagation();
                onAddToPlaylist(item.id);
              }}
            >
              <IoAdd />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
