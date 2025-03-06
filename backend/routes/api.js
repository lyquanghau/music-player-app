const express = require('express');
const axios = require('axios');
const Token = require('../models/Token');

const router = express.Router();

router.get('/search', async (req, res) => {
    try {
        const tokenDoc = await Token.findOne().sort({ createdAt: -1 });
        if (!tokenDoc) {
            return res.status(401).json({ error: 'Không tìm thấy token. Vui lòng đăng nhập lại.' });
        }

        const currentTime = new Date();
        const tokenAge = (currentTime - new Date(tokenDoc.createdAt)) / 1000;
        if (tokenAge > tokenDoc.expiresIn) {
            return res.status(401).json({ error: 'Token đã hết hạn. Vui lòng làm mới token qua /refresh.' });
        }
        const token = tokenDoc.accessToken;

        const query = req.query.q;
        const type = req.query.type || 'track';
        const limit = parseInt(req.query.limit) || 20;

        if (!query) {
            return res.status(400).json({ error: 'Thiếu tham số query (q). Vui lòng cung cấp chuỗi tìm kiếm.' });
        }

        if (limit > 50) {
            return res.status(400).json({ error: 'Giới hạn tối đa là 50 kết quả.' });
        }

        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                q: query,
                type: type,
                limit: limit,
            },
        });

        res.json(response.data);
    } catch (error) {
        if (error.response) {
            // Xử lý lỗi từ Spotify API
            const status = error.response.status;
            const errorData = error.response.data;
            console.error('Lỗi từ Spotify Search API:', errorData);

            if (status === 429) {
                return res.status(429).json({
                    error: 'Tốc độ yêu cầu vượt quá giới hạn. Vui lòng thử lại sau.',
                    retryAfter: error.response.headers['retry-after'] || 5, // Thêm thời gian chờ (giây)
                });
            }
            return res.status(status).json(errorData);
        } else if (error.request) {
            console.error('Không nhận được phản hồi từ Spotify:', error.request);
            return res.status(500).json({ error: 'Lỗi mạng: Không kết nối được tới Spotify API.' });
        } else {
            console.error('Lỗi khác:', error.message);
            return res.status(500).json({ error: 'Lỗi server: ' + error.message });
        }
    }
});

module.exports = router;