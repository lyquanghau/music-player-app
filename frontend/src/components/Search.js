import React, { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { IoSearch, IoArrowForward, IoClose } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";

import "../assets/css/Search.css";
import useSearchHistory from "../hooks/useSearchHistory";
import { useAuth } from "../AuthContext";

/**
 * CHỈ LÀ BASE URL – KHÔNG CÓ /api
 * backend: app.use("/api", apiRoutes)
 */
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8404";

/* ===================== UTILS ===================== */
const debounce = (fn, delay = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/* ===================== COMPONENT ===================== */
const Search = ({ setVideoList }) => {
  const { token } = useAuth();
  const { history, saveHistory, deleteHistory, clearHistory } =
    useSearchHistory(token);

  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===================== SEARCH LOGIC ===================== */
  const performSearch = useCallback(
    async (text) => {
      const q = text.trim();

      if (q.length < 2) {
        setError("Vui lòng nhập ít nhất 2 ký tự");
        return;
      }

      setError("");
      setLoading(true);

      try {
        // Client cache (10 phút)
        const cacheKey = `search_${q}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { items, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 600000) {
            setVideoList(items);
            setLoading(false);
            return;
          }
        }

        // 🔥 GỌI ĐÚNG API
        const res = await axios.get(`${API_BASE}/api/search`, {
          params: { q },
        });

        const items = res.data.items || [];
        setVideoList(items);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            items,
            timestamp: Date.now(),
          })
        );

        if (token) {
          saveHistory(q);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tìm kiếm");
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

  /* ===================== EVENTS ===================== */
  const handleSubmit = () => {
    setExpanded(false);
    performSearch(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleHistoryClick = (text) => {
    setQuery(text);
    setExpanded(false);
    performSearch(text);
  };

  /* ===================== UI DATA ===================== */
  const uniqueHistory = useMemo(() => {
    const map = new Map();
    history.forEach((h) => {
      map.set(h.query.toLowerCase(), h);
    });
    return Array.from(map.values());
  }, [history]);

  /* ===================== RENDER ===================== */
  return (
    <div className="search-wrapper">
      <div className={`search-box ${expanded ? "active" : ""}`}>
        <IoSearch className="search-icon" />

        <input
          type="text"
          placeholder="Tìm nhạc, video, playlist..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            debouncedSearch(e.target.value);
          }}
          onFocus={() => setExpanded(true)}
          onBlur={() => setTimeout(() => setExpanded(false), 150)}
          onKeyDown={handleKeyDown}
        />

        <button className="search-submit" onClick={handleSubmit}>
          <IoArrowForward />
        </button>
      </div>

      {/* DROPDOWN HISTORY */}
      {expanded && token && uniqueHistory.length > 0 && (
        <div className="search-dropdown">
          {uniqueHistory.map((item) => (
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
            <button onMouseDown={clearHistory}>Xóa toàn bộ lịch sử</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
