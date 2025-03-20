const express = require("express");
const axios = require("axios");
const SearchHistory = require("../models/SearchHistory");

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

    // Lưu lịch sử tìm kiếm
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

module.exports = router;
