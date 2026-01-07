const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
      trim: true,
    },

    // Gắn với user đăng nhập (KHÔNG bắt buộc để tránh crash data cũ)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: false,
    },

    // Phân loại search (optional – future-proof)
    type: {
      type: String,
      enum: ["youtube", "playlist", "artist", "other"],
      default: "youtube",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt tự sinh
  }
);

// Index tối ưu query history theo user + thời gian
searchHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("SearchHistory", searchHistorySchema);
