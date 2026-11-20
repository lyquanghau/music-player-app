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

/* ===================== HELPERS ===================== */

function parseDurationToSeconds(iso = "") {
  const match = iso.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const minutes = parseInt(match?.[1] || 0);
  const seconds = parseInt(match?.[2] || 0);
  return minutes * 60 + seconds;
}

/* ===================== SEARCH ===================== */
/**
 * GET /api/search?q=...
 * Public
 */
router.get("/search", checkApiKey, async (req, res) => {
  const query = typeof req.query.q === "string" && req.query.q.length <= 200 && req.query.q.trim();

  if (!query || query.length < 2) {
    return res.status(400).json({
      message: "Query phải có ít nhất 2 ký tự",
    });
  }

  // 🔥 cache key nâng cấp (tránh bị đóng băng kết quả)
  const cacheKey = `yt_search_${query}_v2`;
  const cached = youtubeCache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    // 1️⃣ SEARCH – ưu tiên nhạc, VN, view cao
    const searchRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          videoCategoryId: "10", // 🎵 Music
          regionCode: "VN", // 🇻🇳 Việt Nam
          relevanceLanguage: "vi",
          order: "viewCount", // 🔥 HOT
          maxResults: 25, // QUAN TRỌNG
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const videoIds = searchRes.data.items
      .map((i) => i.id?.videoId)
      .filter(Boolean);

    if (videoIds.length === 0) {
      return res.json({ items: [] });
    }

    // 2️⃣ VIDEOS – lấy duration
    const videosRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet,contentDetails,statistics",
          id: videoIds.join(","),
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    // 3️⃣ MAP + FILTER + SORT
    let items = videosRes.data.items
      .map((v) => {
        const duration = parseDurationToSeconds(
          v.contentDetails?.duration || ""
        );

        return {
          id: v.id,
          title: v.snippet.title,
          channel: v.snippet.channelTitle,
          thumbnail:
            v.snippet.thumbnails?.high?.url ||
            v.snippet.thumbnails?.medium?.url ||
            "",
          duration,
          views: Number(v.statistics?.viewCount || 0),
        };
      })
      .filter(
        (v) =>
          v.duration > 0 &&
          v.duration <= 420 &&
          !v.title.toLowerCase().includes("shorts")
      );

    // 🔥 SORT lại lần nữa cho chắc
    items.sort((a, b) => b.views - a.views);

    // 🎲 Shuffle nhẹ để đỡ “video quen mặt”
    items = items.sort(() => Math.random() - 0.5);

    const response = { items };
    youtubeCache.set(cacheKey, response, 600); // cache 10 phút

    res.json(response);
  } catch (err) {
    console.error("YouTube search error:", err.response?.data || err.message);
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
  const name = typeof req.body.name === "string" && req.body.name.trim();
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

router.post(
  "/custom-playlists/:id/remove-video",
  verifyJWT,
  async (req, res) => {
    const { id } = req.params;
    const videoId = String(req.body.videoId || "").trim();

    if (!videoId || !/^[a-f\d]{24}$/i.test(id)) return res.sendStatus(400);
    try {
      const playlist = await CustomPlaylist.findOneAndUpdate(
        { _id: id, userId: req.user.id }, { $pull: { videos: videoId } }, { new: true }
      );
      if (!playlist) return res.sendStatus(404);
      res.json(playlist);
    } catch {
      res.sendStatus(500);
    }
  }
);

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
      shareUrl: pl.shared ? `${baseUrl}/playlist/${pl._id}` : null,
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
 * Private
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
    const playlist = await CustomPlaylist.findOneAndUpdate(
      { _id: id, userId: req.user.id }, { $addToSet: { videos: videoId } }, { new: true }
    );

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist không tồn tại",
      });
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
 * DELETE /api/custom-playlists/:id
 * Private
 */
router.put("/custom-playlists/:id", verifyJWT, async (req, res) => {
  const { name, shared } = req.body;
  if (!/^[a-f\d]{24}$/i.test(req.params.id) ||
      (name === undefined && shared === undefined) ||
      (name !== undefined && (typeof name !== "string" || !name.trim() || name.trim().length > 100)) ||
      (shared !== undefined && typeof shared !== "boolean")) return res.sendStatus(400);
  const updates = {};
  if (name !== undefined) updates.name = name.trim();
  if (shared !== undefined) updates.shared = shared;
  try {
    const playlist = await CustomPlaylist.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, { $set: updates }, { new: true, runValidators: true }
    );
    if (!playlist) return res.sendStatus(404);
    res.json(playlist);
  } catch {
    res.sendStatus(500);
  }
});

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

    res.json({ message: "Đã xóa playlist thành công" });
  } catch (err) {
    console.error("Delete playlist error:", err);
    res.status(500).json({
      message: "Không thể xóa playlist",
    });
  }
});

/* ===================== SEARCH HISTORY ===================== */

// POST /api/history
router.post("/history", verifyJWT, async (req, res) => {
  const query = typeof req.body.query === "string" && req.body.query.length <= 200 && req.body.query.trim();

  if (!query) {
    return res.status(400).json({
      message: "Query là bắt buộc",
    });
  }

  try {
    const history = await SearchHistory.create({
      query,
      type: "youtube",
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

// DELETE /api/history
router.delete("/history/:id", verifyJWT, async (req, res) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) return res.sendStatus(400);
  try {
    const deleted = await SearchHistory.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.sendStatus(deleted ? 204 : 404);
  } catch {
    res.sendStatus(500);
  }
});

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

/* ===================== HOME / TRENDING ===================== */

router.get("/home", async (req, res) => {
  try {
    const videos = await getTrendingMusicFromYoutube();

    const filtered = videos.filter((v) => v.duration <= 420);
    res.json(filtered.slice(0, 12));
  } catch (err) {
    console.error("HOME API ERROR:", err.message);
    res.status(500).json([]);
  }
});

module.exports = router;
