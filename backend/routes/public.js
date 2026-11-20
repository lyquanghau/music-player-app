const express = require("express");
const router = express.Router();
const CustomPlaylist = require("../models/CustomPlaylist");

router.get("/playlist/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!/^[a-f\d]{24}$/i.test(id)) return res.sendStatus(404);
    const playlist = await CustomPlaylist.findOne({ _id: id, shared: true }).select("name videos thumbnail");
    if (!playlist) {
      return res.status(404).json({ error: "Không tìm thấy playlist" });
    }
    res.json(playlist);
  } catch (error) {
    console.error("Lỗi khi lấy playlist:", error.message);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
