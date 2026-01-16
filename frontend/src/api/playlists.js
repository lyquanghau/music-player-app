// src/api/playlists.js
import api from "./api";

// Lấy danh sách playlist của user
export const getPlaylists = async () => {
  const res = await api.get("/custom-playlists");
  return res.data;
};

// Tạo playlist mới
export const createPlaylist = async (name) => {
  if (!name?.trim()) {
    throw new Error("Playlist name is required");
  }

  const res = await api.post("/custom-playlists", { name });
  return res.data;
};

// Thêm video vào playlist
export const addVideoToPlaylist = async (playlistId, videoId) => {
  if (!playlistId || !videoId) {
    throw new Error("playlistId và videoId là bắt buộc");
  }

  const res = await api.post(`/custom-playlists/${playlistId}/add-video`, {
    videoId,
  });

  return res.data;
};

// Xóa video khỏi playlist
export const removeVideoFromPlaylist = async (playlistId, videoId) => {
  if (!playlistId || !videoId) {
    throw new Error("playlistId và videoId là bắt buộc");
  }

  const res = await api.post(`/custom-playlists/${playlistId}/remove-video`, {
    videoId,
  });

  return res.data;
};
