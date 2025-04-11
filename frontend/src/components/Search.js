// src/components/Search.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/Search.css"; // Import file CSS mới
import { IoSearch } from "react-icons/io5";

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
  const [searchHistory, setSearchHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
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
          setVideoList(videos);
          return;
        }
      } catch (e) {
        localStorage.removeItem(`search_${query}`);
      }
    }

    setErrorMessage("");
    try {
      const response = await axios.get(`${API_URL}/api/search`, {
        params: { q: query },
      });
      const videos = response.data.items;
      setVideoList(videos);
      localStorage.setItem(
        `search_${query}`,
        JSON.stringify({ videos, timestamp: Date.now() })
      );

      await axios.post(`${API_URL}/api/history`, { query });
      fetchHistory();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Có lỗi khi tìm kiếm!");
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
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử tìm kiếm:", error);
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

  // Lọc trùng lặp trong searchHistory
  const uniqueSearchHistory = Array.from(
    new Map(
      searchHistory.map((item) => [item.query.toLowerCase(), item])
    ).values()
  );

  return (
    <div style={{ position: "relative" }}>
      <div className="search-container">
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
        <span className="search-icon" onClick={debouncedSearch}>
          <IoSearch />
        </span>
      </div>

      {errorMessage && (
        <div
          style={{
            color: "#dc3545",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          {errorMessage}
        </div>
      )}

      {isHistoryVisible && (
        <div className="history-container">
          <h3>Lịch sử tìm kiếm</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span></span>
            <button onClick={handleClearHistory} className="clear-history-btn">
              Xóa tất cả
            </button>
          </div>
          <div>
            {uniqueSearchHistory.length > 0 ? (
              uniqueSearchHistory.map((item, index) => (
                <div key={index} className="history-item">
                  <span onClick={() => handleHistoryClick(item.query)}>
                    {item.query}
                  </span>
                  <button
                    onClick={() => handleRemoveHistoryItem(index, item.query)}
                    className="remove-btn"
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p className="no-history">Chưa có lịch sử tìm kiếm</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
