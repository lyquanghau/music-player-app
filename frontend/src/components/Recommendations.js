import React, { useEffect, useState } from "react";
import axios from "axios";

const Recommendations = ({ currentVideoId, onSelectVideo }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentVideoId) {
        setRecommendations([]);
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:8404/api/recommend",
          {
            params: { videoId: currentVideoId },
          }
        );
        setRecommendations(response.data || []);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendations([]);
      }
    };
    fetchRecommendations();
  }, [currentVideoId]);

  return (
    <div style={{ marginTop: "20px" }}>
      <h3 style={{ fontSize: "1.2em", marginBottom: "10px" }}>Video đề xuất</h3>
      {recommendations.length > 0 ? (
        <ul
          style={{
            listStyle: "none",
            padding: "0",
            maxHeight: "200px",
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
                src={item.thumbnail}
                alt={item.title}
                style={{ width: "50px", borderRadius: "4px" }}
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
