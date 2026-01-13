const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
const axiosRetry = require("axios-retry").default;

const SearchHistory = require("../models/SearchHistory");
const CustomPlaylist = require("../models/CustomPlaylist");

const verifyJWT = require("../middleware/verifyJWT");
const checkApiKey = require("../middleware/checkApiKey");
const { getTrendingMusicFromYoutube } = require("../services/youtube.service");

const router = express.Router();

/* ===================== CONFIG ===================== */

const youtubeCache = new NodeCache({ stdTTL: 600 }); // 10 phút

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

/* ===================== SEARCH ===================== */
/**
 * GET /api/search?q=
 * Public (có API key)
 */
router.get("/search", checkApiKey, async (req, res) => {
  const query = req.query.q?.trim();

  if (!query || query.length < 2) {
    return res.status(400).json({
      message: "Query phải có ít nhất 2 ký tự",
    });
  }

  const cacheKey = `yt_search_${query}`;
  const cached = youtubeCache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const { data } = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          maxResults: 10,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const items = data.items
      .filter((item) => item.id?.videoId)
      .map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.default?.url || "",
      }));

    const response = { items };
    youtubeCache.set(cacheKey, response);

    res.json(response);
  } catch (err) {
    console.error("YouTube search error:", err.message);
    res.status(500).json({
      message: "Không thể tìm kiếm video",
    });
  }
});

/* ===================== PLAYLIST ===================== */
/**
 * POST /api/custom-playlists
 * Private
 */
router.post("/custom-playlists", verifyJWT, async (req, res) => {
  const name = req.body.name?.trim();
  const videos = Array.isArray(req.body.videos) ? req.body.videos : [];

  if (!name) {
    return res.status(400).json({
      message: "Tên playlist là bắt buộc",
    });
  }

  try {
    const playlist = await CustomPlaylist.create({
      name,
      videos,
      userId: req.user.id,
    });

    res.status(201).json(playlist);
  } catch (err) {
    console.error("Create playlist error:", err);
    res.status(500).json({
      message: "Không thể tạo playlist",
    });
  }
});

/**
 * GET /api/custom-playlists
 * Private
 */
router.get("/custom-playlists", verifyJWT, async (req, res) => {
  try {
    const playlists = await CustomPlaylist.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    const baseUrl = process.env.BASE_URL || "http://localhost:8404";

    const result = playlists.map((pl) => ({
      ...pl.toObject(),
      shareUrl: `${baseUrl}/playlist/${pl._id}`,
    }));

    res.json(result);
  } catch (err) {
    console.error("Get playlists error:", err);
    res.status(500).json({
      message: "Không thể lấy danh sách playlist",
    });
  }
});

/**
 * POST /api/custom-playlists/:id/add-video
 * Private (owner only)
 */
router.post("/custom-playlists/:id/add-video", verifyJWT, async (req, res) => {
  const { id } = req.params;
  const videoId = String(req.body.videoId || "").trim();

  if (!videoId) {
    return res.status(400).json({
      message: "videoId là bắt buộc",
    });
  }

  try {
    const playlist = await CustomPlaylist.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist không tồn tại",
      });
    }

    const exists = playlist.videos.some((v) => String(v) === videoId);

    if (!exists) {
      playlist.videos.push(videoId);
      await playlist.save();
    }

    res.json(playlist);
  } catch (err) {
    console.error("Add video error:", err);
    res.status(500).json({
      message: "Không thể thêm video",
    });
  }
});

/**
 * POST /api/custom-playlists/:id/remove-video
 * Private (owner only)
 */
router.post(
  "/custom-playlists/:id/remove-video",
  verifyJWT,
  async (req, res) => {
    const { id } = req.params;
    const videoId = String(req.body.videoId || "").trim();

    if (!videoId) {
      return res.status(400).json({
        message: "videoId là bắt buộc",
      });
    }

    try {
      const playlist = await CustomPlaylist.findOne({
        _id: id,
        userId: req.user.id,
      });

      if (!playlist) {
        return res.status(404).json({
          message: "Playlist không tồn tại",
        });
      }

      playlist.videos = playlist.videos.filter((v) => String(v) !== videoId);

      await playlist.save();
      res.json(playlist);
    } catch (err) {
      console.error("Remove video error:", err);
      res.status(500).json({
        message: "Không thể xóa video",
      });
    }
  }
);

/**
 * DELETE /api/custom-playlists/:id
 * Private (owner only)
 */
router.delete("/custom-playlists/:id", verifyJWT, async (req, res) => {
  try {
    const deleted = await CustomPlaylist.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Playlist không tồn tại",
      });
    }

    res.json({
      message: "Đã xóa playlist thành công",
    });
  } catch (err) {
    console.error("Delete playlist error:", err);
    res.status(500).json({
      message: "Không thể xóa playlist",
    });
  }
});

// POST /api/history
router.post("/history", verifyJWT, async (req, res) => {
  const query = req.body.query?.trim();
  const type = req.body.type || "youtube";

  if (!query) {
    return res.status(400).json({
      message: "Query là bắt buộc",
    });
  }

  try {
    const history = await SearchHistory.create({
      query,
      type,
      userId: req.user.id,
    });

    res.status(201).json(history);
  } catch (err) {
    console.error("Save history error:", err);
    res.status(500).json({
      message: "Không thể lưu lịch sử tìm kiếm",
    });
  }
});

// GET /api/history
router.get("/history", verifyJWT, async (req, res) => {
  try {
    const history = await SearchHistory.find({
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(history);
  } catch (err) {
    console.error("Get history error:", err);
    res.status(500).json({
      message: "Không thể lấy lịch sử tìm kiếm",
    });
  }
});

// DELETE /api/history/:id
router.delete("/history/:id", verifyJWT, async (req, res) => {
  try {
    const deleted = await SearchHistory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "History không tồn tại",
      });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error("Delete history error:", err);
    res.status(500).json({
      message: "Không thể xóa history",
    });
  }
});

// DELETE /api/history
router.delete("/history", verifyJWT, async (req, res) => {
  try {
    await SearchHistory.deleteMany({
      userId: req.user.id,
    });

    res.json({ message: "Đã xóa toàn bộ lịch sử" });
  } catch (err) {
    console.error("Clear history error:", err);
    res.status(500).json({
      message: "Không thể xóa lịch sử",
    });
  }
});

router.get("/home", async (req, res) => {
  try {
    const videos = await getTrendingMusicFromYoutube();

    // 🎯 Lọc nhạc < 7 phút
    const filtered = videos.filter((v) => v.duration <= 420);

    res.json(filtered.slice(0, 12));
  } catch (err) {
    console.error("HOME API ERROR:", err.message);
    res.status(500).json([]);
  }
});

module.exports = router;
