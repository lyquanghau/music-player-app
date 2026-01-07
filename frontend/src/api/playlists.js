import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8404/api";

// Lấy danh sách playlist của user
export const getPlaylists = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/custom-playlists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Tạo playlist mới
export const createPlaylist = async (name) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/custom-playlists`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Thêm video vào playlist
export const addVideoToPlaylist = async (playlistId, videoId) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/custom-playlists/${playlistId}/add-video`,
    { videoId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Xóa video khỏi playlist
export const removeVideoFromPlaylist = async (playlistId, videoId) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/custom-playlists/${playlistId}/remove-video`,
    { videoId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
