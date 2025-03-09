const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
    query: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['track', 'artist', 'album'] // giới hạn các loại tìm kiếm
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String, // Lưu ID người dùng từ Spotify (nếu có)
        required: false,
    },
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);