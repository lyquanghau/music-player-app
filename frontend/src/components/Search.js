import React, { useState, useEffect } from "react";
import axios from "axios";

const Search = ({ onSelectVideo, setVideoList, addToPlaylist }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:8404/api/search", {
        params: { q: query },
      });
      setResults(response.data.items);
      setVideoList(response.data.items);
      fetchHistory();
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:8404/api/history");
      setHistory(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử tìm kiếm:", error);
    }
  };

  // Xóa toàn bộ lịch sử tìm kiếm
  const clearHistory = async () => {
    try {
      await axios.delete("http://localhost:8404/api/history");
      setHistory([]);
    } catch (error) {
      console.error("Lỗi khi xóa lịch sử tìm kiếm:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleHistoryClick = (searchQuery) => {
    setQuery(searchQuery);
    handleSearch();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ fontSize: "1.5em", marginBottom: "10px" }}>Tìm kiếm nhạc</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tên bài hát..."
          style={{
            padding: "8px",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "1em",
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
      {history.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ fontSize: "1.2em", margin: 0 }}>Lịch sử tìm kiếm</h3>
            <button
              onClick={clearHistory}
              style={{
                padding: "5px 10px",
                backgroundColor: "transparent",
                color: "#666",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.9em",
              }}
            >
              Xóa hết
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                <path
                  fillRule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                />
              </svg>
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {history.map((item, index) => (
              <div
                key={index}
                onClick={() => handleHistoryClick(item.query)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "16px",
                  cursor: "pointer",
                  fontSize: "0.9em",
                  color: "#333",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e0e0e0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fff")
                }
              >
                {item.query}
              </div>
            ))}
          </div>
        </div>
      )}
      <ul
        style={{
          listStyle: "none",
          padding: "0",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {results.map((item, index) => (
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
                onClick={() => onSelectVideo(item.id, index)}
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
              onClick={() => addToPlaylist(item)}
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
    </div>
  );
};

export default Search;
