const mongoose = require("mongoose");

const customPlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên của danh sách phát
  videos: [{ type: String }], // Danh sách video ID từ YouTube
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo
});

module.exports = mongoose.model("CustomPlaylist", customPlaylistSchema);
