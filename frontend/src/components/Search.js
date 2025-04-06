// src/components/Search.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8404";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Search = ({ onSelectVideo, setVideoList, onAddToPlaylist }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataSource, setDataSource] = useState("");
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const navigate = useNavigate();

  const handleSearch = useCallback(async () => {
    if (query.length < 2) {
      setErrorMessage("Vui lòng nhập ít nhất 2 ký tự để tìm kiếm!");
      return;
    }

    const cachedResults = localStorage.getItem(`search_${query}`);
    if (cachedResults) {
      try {
        const { videos, timestamp } = JSON.parse(cachedResults);
        if (Date.now() - timestamp < 600000) {
          console.log("Lấy từ cache:", videos);
          setSearchResults(videos);
          setVideoList(videos);
          setDataSource("localStorage");
          return;
        }
      } catch (e) {
        console.error("Dữ liệu localStorage không hợp lệ:", e);
        localStorage.removeItem(`search_${query}`);
      }
    }

    setErrorMessage("");
    try {
      console.log("Gọi API:", `${API_URL}/api/search?q=${query}`);
      const response = await axios.get(`${API_URL}/api/search`, {
        params: { q: query },
      });
      const videos = response.data.items;
      console.log("Search results:", videos);

      if (!Array.isArray(videos)) {
        throw new Error("Dữ liệu trả về không phải là mảng!");
      }
      setSearchResults(videos);
      setVideoList(videos);
      localStorage.setItem(
        `search_${query}`,
        JSON.stringify({ videos, timestamp: Date.now() })
      );
      setDataSource(
        response.headers["x-cache"] === "hit" ? "backend cache" : "API"
      );

      try {
        const historyResponse = await axios.post(
          `${API_URL}/api/history`,
          { query },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Đã lưu lịch sử tìm kiếm:", query, historyResponse.data);
        fetchHistory();
      } catch (error) {
        console.error(
          "Lỗi khi lưu lịch sử tìm kiếm:",
          error.message,
          error.response?.data
        );
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error.message, error.response?.data);
      setErrorMessage(
        error.response?.data?.message || "Có lỗi xảy ra khi tìm kiếm!"
      );
    }
  }, [query, setVideoList]);

  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 500),
    [handleSearch]
  );

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/history`);
      setSearchHistory(response.data);
      console.log("Lịch sử tìm kiếm:", response.data);
    } catch (error) {
      console.error(
        "Lỗi khi lấy lịch sử tìm kiếm:",
        error.message,
        error.response?.data
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      debouncedSearch();
      setIsHistoryVisible(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await axios.delete(`${API_URL}/api/history`);
      setSearchHistory([]);
    } catch (error) {
      console.error("Lỗi khi xóa lịch sử tìm kiếm:", error);
    }
  };

  const handleRemoveHistoryItem = async (index, query) => {
    try {
      await axios.delete(`${API_URL}/api/history/${query}`);
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
    setIsHistoryVisible(false);
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsHistoryVisible(true)}
          onBlur={() => setTimeout(() => setIsHistoryVisible(false), 200)}
          placeholder="Từ khóa tìm kiếm..."
          className="search-input"
        />
        <button onClick={debouncedSearch} className="search-btn">
          Tìm
        </button>
      </div>

      {errorMessage && (
        <div style={{ color: "#dc3545", marginBottom: "10px" }}>
          {errorMessage}
        </div>
      )}

      {isHistoryVisible && (
        <div className="history-container">
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
              Xóa tất cả
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
                      cursor: "pointer",
                      color: "#dc3545",
                      fontSize: "16px",
                    }}
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: "#666" }}>Chưa có lịch sử tìm kiếm</p>
            )}
          </div>
        </div>
      )}

      {searchResults.length > 0 && (
        <>
          <h3 style={{ fontSize: "1.2em", marginBottom: "10px" }}>
            Kết quả tìm kiếm
          </h3>
          <p style={{ color: "#666", marginBottom: "10px" }}>
            Nguồn: {dataSource}
          </p>
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
                  loading="lazy"
                />
                <div style={{ flex: 1 }}>
                  <div
                    onClick={() => navigate(`/play/${item.id}`)}
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
                  onClick={() => onAddToPlaylist(item.id)}
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
                  +
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Search;
