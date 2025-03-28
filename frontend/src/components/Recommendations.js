import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8404";

// Hàm debounce để giới hạn tần suất gọi API
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Recommendations = ({ currentVideoId, onSelectVideo }) => {
  const [recommendations, setRecommendations] = useState(() => {
    // Khởi tạo recommendations từ localStorage nếu có
    const cachedRecommendations = localStorage.getItem(
      `recommendations_${currentVideoId}`
    );
    return cachedRecommendations ? JSON.parse(cachedRecommendations) : [];
  });

  const fetchRecommendations = useCallback(
    debounce(async (videoId) => {
      if (!videoId) {
        setRecommendations([]);
        return;
      }

      // Kiểm tra cache trước khi gọi API
      const cachedData = localStorage.getItem(`recommendations_${videoId}`);
      if (cachedData) {
        setRecommendations(JSON.parse(cachedData));
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/recommend`, {
          params: { videoId },
        });
        const data = response.data || [];
        setRecommendations(data);
        // Lưu vào localStorage
        localStorage.setItem(
          `recommendations_${videoId}`,
          JSON.stringify(data)
        );
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendations([]);
      }
    }, 500), // Delay 500ms
    []
  );

  useEffect(() => {
    fetchRecommendations(currentVideoId);
  }, [currentVideoId, fetchRecommendations]);

  return (
    <div style={{ marginTop: "20px" }}>
      <h3 style={{ fontSize: "1.2em", marginBottom: "10px" }}>Video đề xuất</h3>
      {recommendations.length > 0 ? (
        <ul
          style={{
            listStyle: "none",
            padding: "0",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          {recommendations.map((item) => (
            <li
              key={item.id}
              onClick={() => onSelectVideo(item.id, -1)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                borderBottom: "1px solid #eee",
                backgroundColor: "#f9f9f9",
                cursor: "pointer",
              }}
            >
              <img
                src={item.thumbnail || "https://via.placeholder.com/50"}
                alt={item.title}
                style={{ width: "50px", borderRadius: "4px" }}
                loading="lazy" // Thêm lazy loading
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/50";
                }}
              />
              <div>
                <div style={{ fontWeight: "bold", color: "#333" }}>
                  {item.title}
                </div>
                <div style={{ color: "#666", fontSize: "14px" }}>
                  {item.channel}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#666" }}>
          {currentVideoId
            ? "Không có video đề xuất"
            : "Chưa chọn video để đề xuất"}
        </p>
      )}
    </div>
  );
};

export default Recommendations;
