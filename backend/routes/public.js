const express = require("express");
const router = express.Router();
const CustomPlaylist = require("../models/CustomPlaylist");

router.get("/playlist/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const playlist = await CustomPlaylist.findById(id);
    if (!playlist) {
      return res.status(404).json({ error: "Không tìm thấy playlist" });
    }
    res.json(playlist);
  } catch (error) {
    console.error("Lỗi khi lấy playlist:", error.message);
    res.status(500).json({ error: "Lỗi server", details: error.message });
  }
});

module.exports = router;
