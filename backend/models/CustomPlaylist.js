const mongoose = require("mongoose");

const customPlaylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    videos: [{ type: String }],
    thumbnail: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

customPlaylistSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("CustomPlaylist", customPlaylistSchema);
