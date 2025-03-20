const express = require("express");
const axios = require("axios");
const SearchHistory = require("../models/SearchHistory");
const CustomPlaylist = require("../models/CustomPlaylist");

const router = express.Router();

// Endpoint để tìm kiếm video trên YouTube
router.get("/search", async (req, res) => {
  const query = req.query.q;
  try {
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

    const items = response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.default.url,
    }));

    const searchHistory = new SearchHistory({ query });
    await searchHistory.save();

    res.json({ items });
  } catch (error) {
    if (error.response) {
      console.log("Lỗi từ YouTube:", error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.log("Lỗi khác:", error.message);
      res.status(500).send("Lỗi: " + error.message);
    }
  }
});

// Endpoint để lấy lịch sử tìm kiếm
router.get("/history", async (req, res) => {
  try {
    const history = await SearchHistory.find().sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử:", error);
    res.status(500).json({ error: "Lỗi khi lấy lịch sử" });
  }
});

// Endpoint để xóa toàn bộ lịch sử tìm kiếm
router.delete("/history", async (req, res) => {
  try {
    await SearchHistory.deleteMany({});
    res.json({ message: "Đã xóa toàn bộ lịch sử tìm kiếm" });
  } catch (error) {
    console.error("Lỗi khi xóa lịch sử:", error);
    res.status(500).json({ error: "Lỗi khi xóa lịch sử" });
  }
});

// Thêm các endpoint mới cho Custom Playlists
// Tạo một playlist mới
router.post("/custom-playlists", async (req, res) => {
  const { name, videos } = req.body;
  try {
    const playlist = new CustomPlaylist({
      name,
      videos: videos || [], // Nếu không gửi videos, mặc định là mảng rỗng
    });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    console.error("Lỗi khi tạo playlist:", error);
    res.status(500).json({ error: "Lỗi khi tạo playlist" });
  }
});

// Lấy tất cả playlists
router.get("/custom-playlists", async (req, res) => {
  try {
    const playlists = await CustomPlaylist.find().sort({ createdAt: -1 });
    res.json(playlists);
  } catch (error) {
    console.error("Lỗi khi lấy playlists:", error);
    res.status(500).json({ error: "Lỗi khi lấy playlists" });
  }
});

// Thêm video vào playlist theo ID
router.post("/custom-playlists/:id/add-video", async (req, res) => {
  const { id } = req.params;
  const { videoId } = req.body;
  try {
    const playlist = await CustomPlaylist.findById(id);
    if (!playlist) {
      return res.status(404).json({ error: "Không tìm thấy playlist" });
    }
    if (!playlist.videos.includes(videoId)) {
      playlist.videos.push(videoId);
      await playlist.save();
    }
    res.json(playlist);
  } catch (error) {
    console.error("Lỗi khi thêm video vào playlist:", error);
    res.status(500).json({ error: "Lỗi khi thêm video" });
  }
});

module.exports = router;
