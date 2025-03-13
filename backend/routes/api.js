const express = require("express");
const axios = require("axios");
const checkToken = require("../middleware/checkToken");
const Token = require("../models/Token");
const SearchHistory = require("../models/SearchHistory");
const mongoose = require("mongoose");

const router = express.Router();

// Endpoint /search với tích hợp lưu lịch sử tìm kiếm
router.get("/search", checkToken, async (req, res) => {
  try {
    const token = req.accessToken;
    const { q: query, type = "track", limit = 20 } = req.query; // Dùng destructuring để ngắn gọn

    if (!query) {
      return res.status(400).json({
        error: "Thiếu tham số query (q). Vui lòng cung cấp chuỗi tìm kiếm.",
      });
    }

    const safeLimit = Math.min(parseInt(limit), 50); // Giới hạn tối đa 50

    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type, limit: safeLimit },
    });

    // Lưu lịch sử tìm kiếm
    const searchHistory = new SearchHistory({
      query,
      type,
      timestamp: new Date(),
      userId: req.userId,
    });

    await searchHistory.save().catch((err) => {
      console.error("Lỗi khi lưu lịch sử tìm kiếm:", err.message); // Không chặn response nếu lỗi lưu
    });
    console.log(`Đã lưu lịch sử tìm kiếm: ${query} (type: ${type})`);

    res.json(response.data);
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      console.error("Lỗi từ Spotify Search API:", data);
      if (status === 429) {
        return res.status(429).json({
          error: "Tốc độ yêu cầu vượt quá giới hạn. Vui lòng thử lại sau.",
          retryAfter: error.response.headers["retry-after"] || 5,
        });
      }
      return res.status(status).json(data);
    }
    console.error("Lỗi khác:", error.message);
    res.status(500).json({ error: "Lỗi server: " + error.message });
  }
});

// Endpoint /playlists
router.get("/playlists", checkToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query; // Mặc định limit 20, offset 0
    const safeLimit = Math.min(parseInt(limit), 50); // Giới hạn tối đa 50

    console.log("Fetching playlists with token:", req.accessToken);
    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: { Authorization: `Bearer ${req.accessToken}` },
        params: { limit: safeLimit, offset: parseInt(offset) },
      }
    );

    console.log("Spotify API response:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error fetching playlists:",
      error.response ? error.response.data : error.message
    );
    if (error.response) {
      const { status, data } = error.response;
      if (status === 429)
        return res.status(429).json({ error: "Rate limit exceeded" });
      if (status === 401)
        return res.status(401).json({ error: "Invalid or expired token" });
      return res.status(status).json(data);
    }
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

router.get("/history", checkToken, async (req, res) => {
  try {
    // lấy all lịch sử tìm kiếm
    const history = await SearchHistory.find()
      .sort({ timestamp: -1 })
      .limit(50);

    console.log("History: " + history);
    res.status(200).json(history);
  } catch (err) {
    console.log("Error: " + err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// /me
router.get("/me", checkToken, async (req, res) => {
  try {
    const token = req.accessToken;
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userData = response.data;
    console.log("User data:", userData);

    const tokenData = await Token.findOne().sort({ createdAt: -1 });
    if (tokenData) {
      tokenData.userId = userData.id;
      await tokenData.save();
      console.log("Token data updated:", tokenData);
    } else {
      console.log("Token data not found");
    }

    // trả về tt người dùng

    res.status(200).json({
      id: userData.id,
      display_name: userData.display_name,
      email: userData.email,
      country: userData.country,
      profileImage: userData.image?.[0].url || null,
    });
  } catch (err) {
    console.error(
      "Error fetching user data:",
      err.response ? err.response.data : err.message
    );
    if (err.response) {
      const { status, data } = err.response;
      if (status === 429)
        return res.status(429).json({ error: "Rate limit exceeded" });
      if (status === 401)
        return res.status(401).json({ error: "Invalid or expired token" });
      return res.status(status).json(data);
    }
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

module.exports = router;
