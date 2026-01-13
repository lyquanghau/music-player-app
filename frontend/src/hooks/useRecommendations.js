import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8404";

export default function useRecommendations(videoId) {
  const [videos, setVideos] = useState([]);

  const fetchRecommendations = useCallback(async () => {
    if (!videoId) return;

    const cacheKey = `recommend_${videoId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setVideos(JSON.parse(cached));
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/recommend`, {
        params: { videoId },
      });
      setVideos(res.data || []);
      localStorage.setItem(cacheKey, JSON.stringify(res.data || []));
    } catch {
      setVideos([]);
    }
  }, [videoId]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return videos;
}
