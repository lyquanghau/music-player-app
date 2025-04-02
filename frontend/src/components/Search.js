import React, { useState, useEffect, useMemo, useCallback } from "react"; // Thêm useCallback
import axios from "axios";

import { MdDeleteForever, MdOutlinePlaylistAdd } from "react-icons/md";

import { TiDeleteOutline } from "react-icons/ti";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8404";

// Hàm debounce để giới hạn tần suất gọi API
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Search = ({ onSelectVideo, setVideoList, onAddToPlaylist }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); // Sửa: Khởi tạo rỗng
  const [searchHistory, setSearchHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataSource, setDataSource] = useState("");

  // Định nghĩa handleSearch với useCallback
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
          // 10 phút
          console.log("Lấy từ cache:", videos);
          setSearchResults(videos);
          setVideoList(videos);
          setDataSource("localStorage"); // Dữ liệu từ localStorage
          return;
        }
      } catch (e) {
        // Thêm tham số (e) cho catch
        console.error("Dữ liệu localStorage không hợp lệ:", e);
        localStorage.removeItem(`search_${query}`); // Xóa cache lỗi
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
        JSON.stringify({ videos, timestamp: Date.now() }) // Lưu đúng định dạng
      );
      setDataSource(
        response.headers["x-cache"] === "hit" ? "backend cache" : "API"
      ); // Sửa chính tả

      // Thêm: Lưu lịch sử tìm kiếm
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
  }, [query, setVideoList]); // Dependency của handleSearch

  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 500),
    [handleSearch] // Đã thêm handleSearch vào dependency
  );

  useEffect(() => {
    fetchHistory();
  }, []);

  // Hàm lấy lịch sử tìm kiếm
  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/history`);
      setSearchHistory(response.data);
      console.log("Lịch sử tìm kiếm:", response.data); // Thêm log để debug
    } catch (error) {
      console.error(
        "Lỗi khi lấy lịch sử tìm kiếm:",
        error.message,
        error.response?.data
      );
    }
  };

  // Xử lý sự kiện khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      debouncedSearch();
    }
  };

  // Xử lý xóa lịch sử tìm kiếm
  const handleClearHistory = async () => {
    try {
      await axios.delete(`${API_URL}/api/history`);
      setSearchHistory([]);
    } catch (error) {
      console.error("Lỗi khi xóa lịch sử tìm kiếm:", error);
    }
  };

  // Xử lý xóa mục lịch sử tìm kiếm
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
  };

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        // position: "relative",
      }}
    >
      <h2 style={{ fontSize: "1.5em", marginBottom: "10px" }}>Tìm kiếm nhạc</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nghệ sĩ, bài hát, lời bài hát, .v.v"
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={debouncedSearch}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            // transition: "background-color 0.2s",
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
          <MdDeleteForever />
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
                  // borderRadius: "2px",
                  cursor: "pointer",
                  color: "#dc3545",
                  fontSize: "16px",
                }}
              >
                <TiDeleteOutline />
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: "#666" }}>Chưa có lịch sử tìm kiếm</p>
        )}
      </div>

      {searchResults.length > 0 && (
        <>
          <h3 style={{ fontSize: "1.2em", marginBottom: "10px" }}>
            Kết quả tìm kiếm
          </h3>
          <p style={{ color: "#666", marginBottom: "10px" }}>
            Nguồn: {dataSource}
          </p>{" "}
          {/* Hiển thị nguồn dữ liệu */}
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
                  onClick={() => onAddToPlaylist(item.id)} // Chỉ gọi onAddToPlaylist
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
                  <MdOutlinePlaylistAdd />
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
