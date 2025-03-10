const express = require('express');
const axios = require('axios');
const Token = require('../models/Token');
const SearchHistory = require('../models/SearchHistory');
const mongoose = require('mongoose');

const router = express.Router();

// Middleware kiểm tra token
const checkToken = async (req, res, next) => {
    try {
        console.log('Checking token...');
        const tokenData = await Token.findOne().sort({ createdAt: -1 });
        console.log('Token data:', tokenData);
        if (!tokenData) {
            console.log('No token found');
            return res.status(401).json({ error: 'No token found in database' });
        }

        let accessToken = tokenData.accessToken;
        const expiresIn = tokenData.expiresIn;
        const createdAt = tokenData.createdAt;
        const currentTime = new Date();
        const tokenAge = (currentTime - createdAt) / 1000; // Tuổi token tính bằng giây
        console.log('Token age:', tokenAge, 'Expires in:', expiresIn);

        // Kiểm tra nếu token hết hạn
        if (tokenAge > expiresIn) {
            console.log('Token expired, refreshing...');
            const refreshToken = tokenData.refreshToken;
            const refreshResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
                params: {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
                },
            });
            console.log('Refresh response:', refreshResponse.data);

            accessToken = refreshResponse.data.access_token;
            const newExpiresIn = refreshResponse.data.expires_in;

            // Cập nhật token mới vào MongoDB
            tokenData.accessToken = accessToken;
            tokenData.expiresIn = newExpiresIn;
            tokenData.createdAt = new Date();
            await tokenData.save();
            console.log('Token refreshed and saved');
        }

        req.accessToken = accessToken;
        req.userId = tokenData.userId; // Giả sử bạn lưu userId trong Token
        console.log('Proceeding with access token:', accessToken);
        next();
    } catch (error) {
        console.error('Error in checkToken middleware:', error);
        res.status(500).json({ error: 'Failed to validate token' });
    }
};

// Endpoint /search với tích hợp lưu lịch sử tìm kiếm
router.get('/search', checkToken, async (req, res) => {
    try {
        const token = req.accessToken;
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

        // Lưu lịch sử tìm kiếm vào MongoDB
        const searchHistory = new SearchHistory({
            query: query,
            type: type,
            timestamp: new Date(),
            userId: req.userId,
            // userId: có thể thêm sau khi tích hợp endpoint /me để lấy Spotify user ID
        });
        try {
            await searchHistory.save();
            console.log(`Đã lưu lịch sử tìm kiếm: ${query} (type: ${type})`);
        } catch (saveError) {
            console.error('Lỗi khi lưu lịch sử tìm kiếm:', saveError);
            // Vẫn trả dữ liệu từ Spotify để không ảnh hưởng trải nghiệm người dùng
        }

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
                    retryAfter: error.response.headers['retry-after'] || 5,
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

// Endpoint /playlists
router.get('/playlists', checkToken, async (req, res) => {
    try {
        console.log('Fetching playlists with token:', req.accessToken);
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        console.log('Request params:', { limit, offset });

        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: { Authorization: `Bearer ${req.accessToken}` },
            params: { limit, offset },
        });

        console.log('Spotify API response:', response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching playlists:', error.response ? error.response.data : error.message);
        if (error.response) {
            const { status, data } = error.response;
            if (status === 429) return res.status(429).json({ error: 'Rate limit exceeded' });
            if (status === 401) return res.status(401).json({ error: 'Invalid or expired token' });
            return res.status(status).json(data);
        }
        res.status(500).json({ error: 'Failed to fetch playlists' });
    }
});

module.exports = router;