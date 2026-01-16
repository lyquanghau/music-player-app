// src/api/songs.js
import api from "./api";

// Tìm kiếm bài hát (YouTube)
export const searchSongs = async (query) => {
  if (!query?.trim()) {
    return { items: [] };
  }

  const res = await api.get("/songs/search", {
    params: { query },
  });

  return res.data;
};

// Lấy danh sách bài hát (nếu backend có)
export const getAllSongs = async () => {
  const res = await api.get("/songs");
  return res.data;
};
