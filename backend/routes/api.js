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

// backend/routes/api.js

router.get("/me", async (req, res) => {
  const refreshToken = req.headers.authorization?.split(" ")[1];
  if (!refreshToken) {
    return res
      .status(400)
      .json({ error: "Không tìm thấy refresh_token trong header" });
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const { access_token } = response.data;
    res.json({ access_token });
  } catch (error) {
    console.error(
      "Lỗi khi làm mới token:",
      error.response ? error.response.data : error.message
    );
    res.status(400).json({
      error: "Không thể làm mới token",
      details: error.response ? error.response.data : error.message,
    });
  }
});

router.get("/playlists/:id/tracks", checkToken, async (req, res) => {
  try {
    const { id } = req.params; // Lấy playlist ID từ URL
    const { limit = 20, offset = 0 } = req.query; // Mặc định limit 20, offset 0
    const token = req.accessToken;

    if (!id) {
      return res.status(400).json({ error: "Thiếu tham số playlist ID." });
    }

    const safeLimit = Math.min(parseInt(limit), 100); // Giới hạn tối đa 100 (theo Spotify API)

    // Gọi Spotify API để lấy danh sách bài hát trong playlist
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${id}/tracks`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit: safeLimit,
          offset: parseInt(offset),
          fields:
            "items(track(id,name,artists,album,duration_ms)),total,limit,offset,next,previous",
        },
      }
    );

    const tracksData = response.data;
    console.log("Tracks data from Spotify:", tracksData);

    // Trả về danh sách bài hát
    res.status(200).json({
      total: tracksData.total,
      limit: tracksData.limit,
      offset: tracksData.offset,
      next: tracksData.next,
      previous: tracksData.previous,
      tracks: tracksData.items.map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map((artist) => artist.name),
        album: item.track.album.name,
        durationMs: item.track.duration_ms,
      })),
    });
  } catch (error) {
    console.error(
      "Error fetching playlist tracks:",
      error.response ? error.response.data : error.message
    );
    if (error.response) {
      const { status, data } = error.response;
      if (status === 404)
        return res.status(404).json({ error: "Playlist không tồn tại." });
      if (status === 401)
        return res.status(401).json({ error: "Invalid or expired token." });
      return res.status(status).json(data);
    }
    res.status(500).json({ error: "Failed to fetch playlist tracks." });
  }
});

router.get("/playback", checkToken, async (req, res) => {
  try {
    const token = req.accessToken;

    // Gọi API Spotify để lấy trạng thái phát nhạc
    const response = await axios.get("https://api.spotify.com/v1/me/player", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const playbackData = response.data;
    console.log("Playback state fetched:", playbackData);

    // Trả về dữ liệu JSON từ Spotify
    res.status(200).json({
      isPlaying: playbackData.is_playing,
      device: {
        id: playbackData.device?.id || null,
        name: playbackData.device?.name || null,
        type: playbackData.device?.type || null,
        volumePercent: playbackData.device?.volume_percent || null,
      },
      progressMs: playbackData.progress_ms,
      track: {
        id: playbackData.item?.id || null,
        name: playbackData.item?.name || null,
        artists: playbackData.item?.artists?.map((artist) => artist.name) || [],
        album: playbackData.item?.album?.name || null,
        durationMs: playbackData.item?.duration_ms || null,
      },
    });
  } catch (error) {
    console.error(
      "Error fetching playback state:",
      error.response ? error.response.data : error.message
    );
    if (error.response) {
      const { status, data } = error.response;
      if (status === 429) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      }
      if (status === 401) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
      if (status === 204) {
        // Không có thiết bị nào đang phát nhạc
        return res.status(200).json({ message: "No active device found" });
      }
      return res.status(status).json(data);
    }
    res.status(500).json({ error: "Failed to fetch playback state" });
  }
});

module.exports = router;
