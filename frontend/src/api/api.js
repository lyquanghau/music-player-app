import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 15000, // chống treo khi Render cold start
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ❗ Optional nhưng rất nên có
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Render free tier hay timeout lần đầu
    if (!error.response && error.code === "ECONNABORTED") {
      console.warn("Backend cold start, retrying...");
    }
    return Promise.reject(error);
  }
);

export default api;
