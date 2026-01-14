import React, { useState, useMemo, useCallback } from "react";
import { IoSearch, IoArrowForward, IoClose } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";

import "../assets/css/Search.css";
import useSearchHistory from "../hooks/useSearchHistory";
import { useAuth } from "../AuthContext";
import api from "../api/api";

/* ===================== DEBOUNCE ===================== */
const debounce = (fn, delay = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const Search = ({ setVideoList, variant = "default" }) => {
  const { token } = useAuth();
  const { history, saveHistory, deleteHistory, clearHistory } =
    useSearchHistory(token);

  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===================== SEARCH LOGIC ===================== */
  const performSearch = useCallback(
    async (text) => {
      const q = text.trim();

      // ❗ chỉ search khi >= 2 ký tự
      if (q.length < 2) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        // 👉 GỌI ĐÚNG AXIOS INSTANCE (baseURL = /api)
        const res = await api.get("/search", {
          params: { q },
        });

        const items = res.data?.items || [];

        setVideoList(items);

        if (token) saveHistory(q);
      } catch (err) {
        console.error("Search error:", err);
        setError("Không thể tìm kiếm");
        setVideoList([]);
      } finally {
        setLoading(false);
      }
    },
    [setVideoList, saveHistory, token]
  );

  const debouncedSearch = useMemo(
    () => debounce(performSearch, 500),
    [performSearch]
  );

  /* ===================== INPUT HANDLER ===================== */
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // clear kết quả khi input rỗng
    if (!value.trim()) {
      setVideoList([]);
      setLoading(false);
      setError("");
      return;
    }

    debouncedSearch(value);
  };

  const handleSubmit = () => {
    performSearch(query);
  };

  const handleHistoryClick = (text) => {
    setQuery(text);
    performSearch(text);
    setExpanded(false);
  };

  /* ===================== RENDER ===================== */
  return (
    <div className={`search-wrapper search-${variant}`}>
      <div className={`search-box ${expanded ? "active" : ""}`}>
        <IoSearch className="search-icon" />

        <input
          type="text"
          placeholder="Tìm bài hát, nghệ sĩ, playlist..."
          value={query}
          onChange={handleChange}
          onFocus={() => setExpanded(true)}
          onBlur={() => setTimeout(() => setExpanded(false), 150)}
        />

        <button className="search-submit" onClick={handleSubmit}>
          <IoArrowForward />
        </button>
      </div>

      {/* STATUS */}
      {expanded && (loading || error) && (
        <div className="search-status">
          {loading ? "Đang tìm kiếm..." : error}
        </div>
      )}

      {/* SEARCH HISTORY */}
      {expanded && token && history.length > 0 && (
        <div className="search-dropdown">
          {history.map((item) => (
            <div
              key={item._id}
              className="dropdown-item"
              onMouseDown={() => handleHistoryClick(item.query)}
            >
              <FaArrowTrendUp className="dropdown-icon" />
              <span className="dropdown-text">{item.query}</span>

              <button
                className="dropdown-remove"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  deleteHistory(item._id);
                }}
              >
                <IoClose />
              </button>
            </div>
          ))}

          <div className="dropdown-footer">
            <button onMouseDown={clearHistory}>Clear search history</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
