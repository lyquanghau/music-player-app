import React, { useState, useEffect } from "react";
import axios from "axios";

const Search = ({ onSelectVideo, setVideoList, onAddToPlaylist }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchHistory();
    fetchPlaylists();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:8404/api/history");
      setSearchHistory(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử tìm kiếm:", error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8404/api/custom-playlists"
      );
      setPlaylists(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách playlist:", error);
    }
  };

  const handleSearch = async () => {
    if (query.length < 2) {
      setErrorMessage("Vui lòng nhập ít nhất 2 ký tự để tìm kiếm!");
      return;
    }

    setErrorMessage("");
    try {
      const response = await axios.get("http://localhost:8404/api/search", {
        params: { q: query },
      });
      const videos = response.data.items;
      console.log("Search results:", videos);
      if (!Array.isArray(videos)) {
        throw new Error("Dữ liệu trả về không phải là mảng!");
      }
      setSearchResults(videos);
      setVideoList(videos);
      fetchHistory();
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setErrorMessage(
        error.response?.data?.message || "Có lỗi xảy ra khi tìm kiếm!"
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearHistory = async () => {
    try {
      await axios.delete("http://localhost:8404/api/history");
      setSearchHistory([]);
    } catch (error) {
      console.error("Lỗi khi xóa lịch sử tìm kiếm:", error);
    }
  };

  const handleRemoveHistoryItem = async (index, query) => {
    try {
      await axios.delete(`http://localhost:8404/api/history/${query}`);
      setSearchHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory.splice(index, 1);
        return newHistory;
      });
    } catch (error) {
      console.error("Lỗi khi xóa mục lịch sử tìm kiếm:", error);
    }
  };

  const handleHistoryClick = (searchQuery) => {
    setQuery(searchQuery);
    handleSearch();
  };

  const openPlaylistModal = (video) => {
    setSelectedVideo(video);
    setShowPlaylistModal(true);
  };

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylistId) {
      alert("Vui lòng chọn một playlist!");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8404/api/custom-playlists/${selectedPlaylistId}/add-video`,
        { videoId: selectedVideo.id }
      );
      onAddToPlaylist(selectedPlaylistId, response.data);
      fetchPlaylists();
      setShowPlaylistModal(false);
      setSelectedPlaylistId("");
    } catch (error) {
      console.error("Lỗi khi thêm video vào playlist:", error);
      alert(
        "Có lỗi xảy ra khi thêm video! Vui lòng kiểm tra console để biết thêm chi tiết."
      );
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      <h2 style={{ fontSize: "1.5em", marginBottom: "10px" }}>Tìm kiếm nhạc</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="rất lâu rồi mới khóc"
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#0056b3")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#007bff")
          }
        >
          Tìm
        </button>
      </div>

      {errorMessage && (
        <div style={{ color: "#dc3545", marginBottom: "10px" }}>
          {errorMessage}
        </div>
      )}

      {/* Lịch sử tìm kiếm nằm ngay dưới ô tìm kiếm */}
      <h3 style={{ fontSize: "1.2em", marginBottom: "10px" }}>
        Lịch sử tìm kiếm
      </h3>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <span></span>
        <button
          onClick={handleClearHistory}
          style={{
            padding: "4px 8px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Xóa hết
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {searchHistory.length > 0 ? (
          searchHistory.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "5px 10px",
                backgroundColor: "#fff",
                borderRadius: "4px",
              }}
            >
              <span
                onClick={() => handleHistoryClick(item.query)}
                style={{ cursor: "pointer", marginRight: "5px" }}
              >
                {item.query}
              </span>
              <button
                onClick={() => handleRemoveHistoryItem(index, item.query)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#dc3545",
                  fontSize: "16px",
                }}
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: "#666" }}>Chưa có lịch sử tìm kiếm</p>
        )}
      </div>

      {/* Kết quả tìm kiếm nằm dưới lịch sử tìm kiếm */}
      {searchResults.length > 0 && (
        <>
          <h3 style={{ fontSize: "1.2em", marginBottom: "10px" }}>
            Kết quả tìm kiếm
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: "0",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {searchResults.map((item, index) => (
              <li
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  backgroundColor: "#f9f9f9",
                  transition: "background-color 0.2s",
                }}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  style={{ width: "50px", borderRadius: "4px" }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    onClick={() => {
                      console.log("Clicked video:", { id: item.id, index });
                      onSelectVideo(item.id, index);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ fontWeight: "bold", color: "#333" }}>
                      {item.title}
                    </div>
                    <div style={{ color: "#666", fontSize: "14px" }}>
                      {item.channel}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openPlaylistModal(item)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#218838")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#28a745")
                  }
                >
                  Thêm vào danh sách phát
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {showPlaylistModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3>Chọn playlist</h3>
            <select
              value={selectedPlaylistId}
              onChange={(e) => setSelectedPlaylistId(e.target.value)}
              style={{
                padding: "5px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "100%",
                marginBottom: "10px",
              }}
            >
              <option value="">Chọn playlist</option>
              {playlists.map((playlist) => (
                <option key={playlist._id} value={playlist._id}>
                  {playlist.name}
                </option>
              ))}
            </select>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                onClick={handleAddToPlaylist}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Thêm
              </button>
              <button
                onClick={() => setShowPlaylistModal(false)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
