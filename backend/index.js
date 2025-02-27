const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const connectDB = require('./db');
const Token = require('./models/Token'); // Sửa chính tả
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;

connectDB();

app.get('/', (req, res) => {
    res.send('ly quang hau');
});

app.get('/login', (req, res) => {
    const scope = 'user-read-private user-read-email streaming playlist-read-private';
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}`;
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    if (!code) {
        return res.status(400).json({
            error: 'Lỗi: Không tìm thấy mã code.'
        });
    }

    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: SPOTIFY_REDIRECT_URI,
            }),
            headers: {
                'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const {
            access_token,
            refresh_token,
            expires_in
        } = response.data;

        const tokenDoc = new Token({
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in,
        });
        await tokenDoc.save();
        console.log('Đã lưu token:', tokenDoc);

        res.json({
            access_token,
            refresh_token,
            expires_in
        });
    } catch (error) {
        if (error.response) {
            console.log('Lỗi từ Spotify:', error.response.data);
            res.send('Lỗi khi lấy token: ' + JSON.stringify(error.response.data));
        } else if (error.request) {
            console.log('Không nhận được phản hồi:', error.request);
            res.send('Lỗi mạng: Không kết nối được tới Spotify');
        } else {
            console.log('Lỗi khác:', error.message);
            res.send('Lỗi: ' + error.message);
        }
    }
});

app.get('/refresh', async (req, res) => {
    try {
        const tokenDoc = await Token.findOne().sort({
            createdAt: -1
        });
        console.log('Token tìm thấy:', tokenDoc);
        if (!tokenDoc || !tokenDoc.refreshToken) {
            return res.status(404).json({
                error: 'Không tìm thấy refresh token trong MongoDB'
            });
        }

        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify({
                grant_type: 'refresh_token',
                refresh_token: tokenDoc.refreshToken,
            }),
            headers: {
                'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const {
            access_token,
            expires_in
        } = response.data;

        tokenDoc.accessToken = access_token;
        tokenDoc.expiresIn = expires_in;
        tokenDoc.createdAt = new Date();
        await tokenDoc.save();
        console.log('Token đã cập nhật:', tokenDoc);

        res.json({
            access_token,
            expires_in
        });
    } catch (e) {
        if (e.response) {
            console.log('Lỗi từ Spotify:', e.response.data);
            res.status(e.response.status).json(e.response.data);
        } else {
            console.log('Lỗi khác:', e.message);
            res.status(500).json({
                error: e.message
            });
        }
    }
});

app.get('/me', async (req, res) => {
    const accessToken = req.query.token;
    if (!accessToken) {
        return res.status(400).json({
            error: 'Lỗi: Không có Access Token'
        });
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
        if (error.response) {
            console.log('Lỗi từ Spotify:', error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.log('Lỗi khác:', error.message);
            res.status(500).json({
                error: error.message
            });
        }
    }
});

app.listen(port, () => {
    console.log(`Server chạy trên http://localhost:${port}`);
});