const mongoose = require("mongoose");

const TrendingSongSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
      index: true,
    },

    title: String,
    artist: String,
    thumbnail: String,

    viewCount: Number,
    likeCount: Number,
    commentCount: Number,

    trendScore: {
      type: Number,
      index: true,
    },

    change: {
      type: Number,
      default: 0,
    },

    snapshotDate: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true }
);

/**
 * 🔒 Đảm bảo: 1 video / 1 ngày
 */
TrendingSongSchema.index({ videoId: 1, snapshotDate: 1 }, { unique: true });

module.exports = mongoose.model("TrendingSong", TrendingSongSchema);
