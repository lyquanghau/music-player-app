const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const connectDB = require('./db');
const Token = require('./models/Token');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8404;

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:6704',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Xử lý preflight OPTIONS request
app.options('*', cors());

// Kết nối MongoDB
connectDB();

// Trang chủ (khởi tạo)
app.get('/', (req, res) => {
    res.send('Welcome to Music Player Backend - Giai đoạn 2');
});

// Endpoint /login cho xác thực Spotify
app.get('/login', (req, res) => {
    const scope = 'user-read-private user-read-email streaming playlist-read-private';
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}`;
    console.log('Generated Spotify auth URL:', authUrl);
    res.json({ url: authUrl }); // Trả về JSON để frontend xử lý redirect
});

// Các endpoint khác (giữ nguyên từ Tuần 2)
app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    if (!code) {
        return res.status(400).json({ error: 'Lỗi: Không tìm thấy mã code.' });
    }

    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            }),
            headers: {
                'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token, refresh_token, expires_in } = response.data;

        // Kiểm tra và lưu/cập nhật token vào MongoDB
        let tokenDoc = await Token.findOne().sort({ createdAt: -1 });
        if (tokenDoc) {
            tokenDoc.accessToken = access_token;
            tokenDoc.refreshToken = refresh_token;
            tokenDoc.expiresIn = expires_in;
            tokenDoc.createdAt = new Date();
            await tokenDoc.save();
        } else {
            tokenDoc = new Token({ accessToken: access_token, refreshToken: refresh_token, expiresIn: expires_in });
            await tokenDoc.save();
        }
        console.log('Đã lưu/cập nhật token:', tokenDoc);

        // Redirect về frontend với token
        res.redirect(`http://localhost:6704/callback?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`);
    } catch (error) {
        handleError(error, res);
    }
});

app.get('/me', async (req, res) => {
    const accessToken = req.query.token;
    if (!accessToken) {
        return res.status(400).json({ error: 'Lỗi: Không có Access Token' });
    }

    try {
        const response = await axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
        });
        res.json(response.data);
    } catch (error) {
        handleError(error, res);
    }
});

app.get('/refresh', async (req, res) => {
    try {
        const tokenDoc = await Token.findOne().sort({ createdAt: -1 });
        if (!tokenDoc || !tokenDoc.refreshToken) {
            return res.status(404).json({ error: 'Không tìm thấy refresh token trong MongoDB' });
        }

        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify({
                grant_type: 'refresh_token',
                refresh_token: tokenDoc.refreshToken,
            }),
            headers: {
                'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token, expires_in } = response.data;

        tokenDoc.accessToken = access_token;
        tokenDoc.expiresIn = expires_in;
        tokenDoc.createdAt = new Date();
        await tokenDoc.save();
        console.log('Token đã cập nhật:', tokenDoc);

        res.json({ access_token, expires_in });
    } catch (e) {
        handleError(e, res);
    }
});

// Hàm xử lý lỗi
function handleError(error, res) {
    if (error.response) {
        console.log('Lỗi từ Spotify:', error.response.data);
        res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
        console.log('Không nhận được phản hồi:', error.request);
        res.status(500).send('Lỗi mạng: Không kết nối được tới Spotify');
    } else {
        console.log('Lỗi khác:', error.message);
        res.status(500).send('Lỗi: ' + error.message);
    }
}

// Khởi chạy server
app.listen(port, () => {
    console.log(`Server chạy trên http://localhost:${port}`);
});