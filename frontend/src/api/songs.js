import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8404/api";

export const searchSongs = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/songs/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching songs:", error);
    throw error;
  }
};

export const getAllSongs = async () => {
  try {
    const response = await axios.get(`${API_URL}/songs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching songs:", error);
    throw error;
  }
};
