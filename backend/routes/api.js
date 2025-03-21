const express = require("express");
const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const SearchHistory = require("../models/SearchHistory");
const CustomPlaylist = require("../models/CustomPlaylist");

const router = express.Router();

// Cấu hình retry cho axios để xử lý rate limit
axiosRetry(axios, {
  retries: 3, // Thử lại 3 lần nếu gặp lỗi
  retryDelay: (retryCount) => retryCount * 1000, // Delay tăng dần: 1s, 2s, 3s
  retryCondition: (error) => {
    // Thử lại nếu gặp lỗi 429 (rate limit) hoặc 503 (server tạm thời không khả dụng)
    return (
      error.response &&
      (error.response.status === 429 || error.response.status === 503)
    );
  },
});

const checkApiKey = require("../middleware/checkApiKey");

// Endpoint để tìm kiếm video trên YouTube
router.get("/search", checkApiKey, async (req, res) => {
  const { q: query } = req.query; // Destructuring query params

  // Kiểm tra xem query có tồn tại và không rỗng
  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Tham số tìm kiếm (q) là bắt buộc" });
  }

  // Kiểm tra độ dài query
  if (query.length < 2) {
    return res.status(400).json({ error: "Query phải có ít nhất 2 ký tự" });
  }

  try {
    // Log request
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          maxResults: 10,
          q: query,
          type: "video",
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const items = response.data.items
      .filter((item) => item.id.videoId) // Lọc các item không có videoId
      .map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.default.url,
      }));

    // Lưu lịch sử tìm kiếm
    const searchHistory = new SearchHistory({ query });
    await searchHistory.save(); // Log lưu thành công

    res.json({ items });
  } catch (error) {
    if (error.response) {
      console.error("Lỗi từ YouTube API:", error.response.data);
      res.status(error.response.status).json({
        error: "Lỗi từ YouTube API",
        details: error.response.data,
      });
    } else {
      console.error("Lỗi khác:", error.message);
      res.status(500).json({ error: "Lỗi server", details: error.message });
    }
  }
});

// Endpoint để lấy thông tin video theo ID
router.get("/video/:id", checkApiKey, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "videoId là bắt buộc" });
  }

  try {
    // Log request
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet",
          id,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy video" });
    }
    const item = response.data.items[0];
    const video = {
      id: item.id,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.default.url,
    };
    res.json(video);
  } catch (error) {
    if (error.response) {
      console.error("Lỗi từ YouTube API:", error.response.data);
      res.status(error.response.status).json({
        error: "Lỗi từ YouTube API",
        details: error.response.data,
      });
    } else {
      console.error("Lỗi khác:", error.message);
      res.status(500).json({ error: "Lỗi server", details: error.message });
    }
  }
});

// Endpoint để lấy lịch sử tìm kiếm
router.get("/history", async (req, res) => {
  try {
    const history = await SearchHistory.find()
      .sort({ timestamp: -1 })
      .limit(50); // Giới hạn tối đa 50 kết quả // Log số lượng kết quả
    res.json(history);
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử:", error.message);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy lịch sử", details: error.message });
  }
});

// Endpoint để xóa toàn bộ lịch sử tìm kiếm
router.delete("/history", async (req, res) => {
  try {
    const result = await SearchHistory.deleteMany({});
    console.log(`Đã xóa ${result.deletedCount} lịch sử tìm kiếm`); // Log số lượng xóa
    res.json({ message: "Đã xóa toàn bộ lịch sử tìm kiếm" });
  } catch (error) {
    console.error("Lỗi khi xóa lịch sử:", error.message);
    res
      .status(500)
      .json({ error: "Lỗi khi xóa lịch sử", details: error.message });
  }
});

// Tạo một playlist mới
router.post("/custom-playlists", async (req, res) => {
  const { name, videos } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Tên playlist (name) là bắt buộc" });
  }

  try {
    const playlist = new CustomPlaylist({
      name,
      videos: videos || [],
    });
    await playlist.save();
    console.log(`Đã tạo playlist: ${name}`); // Log tạo thành công
    res.status(201).json(playlist);
  } catch (error) {
    console.error("Lỗi khi tạo playlist:", error.message);
    res
      .status(500)
      .json({ error: "Lỗi khi tạo playlist", details: error.message });
  }
});

// Lấy tất cả playlists
router.get("/custom-playlists", async (req, res) => {
  try {
    const playlists = await CustomPlaylist.find().sort({ createdAt: -1 });
    res.json(playlists);
  } catch (error) {
    console.error("Lỗi khi lấy playlists:", error.message);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy playlists", details: error.message });
  }
});

// Thêm video vào playlist theo ID
router.post("/custom-playlists/:id/add-video", async (req, res) => {
  const { id } = req.params;
  const { videoId } = req.body;

  if (!videoId) {
    return res.status(400).json({ error: "videoId là bắt buộc" });
  }

  try {
    const playlist = await CustomPlaylist.findById(id);
    if (!playlist) {
      return res.status(404).json({ error: "Không tìm thấy playlist" });
    }
    if (!playlist.videos.includes(videoId)) {
      playlist.videos.push(videoId);
      await playlist.save();
      console.log(`Đã thêm video ${videoId} vào playlist ${id}`); // Log thêm thành công
    }
    res.json(playlist);
  } catch (error) {
    console.error("Lỗi khi thêm video vào playlist:", error.message);
    res
      .status(500)
      .json({ error: "Lỗi khi thêm video", details: error.message });
  }
});

// Xóa video khỏi playlist theo ID
router.post("/custom-playlists/:id/remove-video", async (req, res) => {
  const { id } = req.params;
  const { videoId } = req.body;

  if (!videoId) {
    return res.status(400).json({ error: "videoId là bắt buộc" });
  }

  try {
    const playlist = await CustomPlaylist.findById(id);
    if (!playlist) {
      return res.status(404).json({ error: "Không tìm thấy playlist" });
    }

    playlist.videos = playlist.videos.filter((vid) => vid !== videoId);
    await playlist.save();
    console.log(`Đã xóa video ${videoId} khỏi playlist ${id}`); // Log xóa thành công
    res.json(playlist);
  } catch (error) {
    console.error("Lỗi khi xóa video khỏi playlist:", error.message);
    res
      .status(500)
      .json({ error: "Lỗi khi xóa video", details: error.message });
  }
});

// Endpoint để lấy video đề xuất
router.get("/recommend", checkApiKey, async (req, res) => {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: "videoId là bắt buộc" });
  }

  try {
    console.log(`Lấy video đề xuất cho videoId: ${videoId}`); // Log request
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          maxResults: 10,
          relatedToVideoId: videoId,
          type: "video",
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const items = response.data.items
      .filter((item) => item.id.videoId) // Lọc các item không có videoId
      .map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.default.url,
      }));

    res.json({ items });
  } catch (error) {
    if (error.response) {
      console.error("Lỗi từ YouTube API:", error.response.data);
      res.status(error.response.status).json({
        error: "Lỗi từ YouTube API",
        details: error.response.data,
      });
    } else {
      console.error("Lỗi khác:", error.message);
      res.status(500).json({ error: "Lỗi server", details: error.message });
    }
  }
});

module.exports = router;
