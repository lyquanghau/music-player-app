const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema({
  query: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  // Nếu bạn vẫn muốn giữ userId và type, nhưng không bắt buộc
  userId: { type: String, required: false }, // Không bắt buộc
  type: { type: String, required: false }, // Không bắt buộc
});

module.exports = mongoose.model("SearchHistory", searchHistorySchema);
