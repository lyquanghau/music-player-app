const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: { type: String },
});

module.exports = mongoose.model("Token", tokenSchema, "spotify_tokens");
