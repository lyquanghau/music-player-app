const express = require('express');
const axios = require('axios');
const querystring = require('querystring'); // Thêm để xử lý dữ liệu form-urlencoded
require('dotenv').config(); // Load biến từ file .env

const app = express();
const port = process.env.PORT || 3000; // Giá trị mặc định là 3000 nếu PORT không được định nghĩa
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;

app.get('/', (req, res) => {
    res.send('ly quang hau');
});

app.get('/login', (req, res) => {
    const scope = 'user-read-private user-read-email';
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
            data: querystring.stringify({ // Chuyển dữ liệu sang định dạng form-urlencoded
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: SPOTIFY_REDIRECT_URI, // Sửa thành SPOTIFY_REDIRECT_URI
            }),
            headers: {
                'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'), // Sửa thành SPOTIFY_*
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const {
            access_token,
            refresh_token
        } = response.data;
        res.send(`Access Token: ${access_token}<br>Refresh Token: ${refresh_token}`);
    } catch (error) {
        // Xử lý lỗi an toàn
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
app.get('/me', async (req, res) => {
    const accessToken = 'BQCP3eyMnC_LrnEoHG-0NZoKUYkcNHKBDbVY6N7m2z85iHYaaac30yZUPxhTPalnIfdTHIU78zlaRgi6BMqtHDAp6uxT5YB4VHEViN1SZzZcF16JiaWFAEnjvU3V-cBqNxnxxji1tYmBUfDgpZjnafad03W5AESLpNx5V00UsRBl9LFEs6DjRO-tUYim2AuvcL0hBa9ms3Y0DaBiTsf1x0NS9q6RwbiS_WbJkBhIyyjpKMvSg3wWGQ'; // Dán Access Token của bạn vào đây
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
        res.send('Lỗi: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
    }
});
app.listen(port, () => {
    console.log(`Server chạy trên http://localhost:${port}`);
});