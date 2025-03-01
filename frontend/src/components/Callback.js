import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
    const [searchParams] = useSearchParams();
    const [tokens, setTokens] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const expiresIn = searchParams.get('expires_in');

        if (accessToken && refreshToken && expiresIn) {
            setTokens({ access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn });
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            console.log('Tokens received:', { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn });

            // Xóa lỗi cũ nếu có
            localStorage.removeItem('auth_error');
            console.log('Tokens received and stored:', { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn });
        } else {
            setError('Lỗi: Không nhận được token từ Spotify.');
        }
    }, [searchParams]);

    const fetchMe = async () => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            try {
                const response = await axios.get(`http://localhost:8404/me?token=${accessToken}`, {
                    withCredentials: true,
                });
                console.log('User info:', response.data);
                alert(`Thông tin người dùng: ${response.data.display_name} (${response.data.email})`);
            } catch (err) {
                console.error('Error fetching user:', err);
                alert('Lỗi khi lấy thông tin người dùng: ' + (err.response ? err.response.data.error : err.message));
            }
        } else {
            alert('Không tìm thấy access_token trong localStorage.');
        }
    };

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:8404/refresh', {
                withCredentials: true,
            });
            const newAccessToken = response.data.access_token;
            localStorage.setItem('access_token', newAccessToken);
            console.log('New access token:', newAccessToken);
            alert(`Token mới: ${newAccessToken.substring(0, 10)}...`);
        } catch (err) {
            console.error('Error refreshing token:', err);
            alert('Lỗi khi làm mới token: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!tokens) return <div>Đang xử lý...</div>;

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Đăng nhập thành công!</h2>
            <p>Access Token: {tokens.access_token.substring(0, 10)}...</p>
            <p>Refresh Token: {tokens.refresh_token.substring(0, 10)}...</p>
            <p>Expires in: {tokens.expires_in} seconds</p>

            {/* Thêm các nút /me và /refresh */}
            <button
                onClick={fetchMe}
                style={{ padding: '10px 20px', marginTop: '20px', marginRight: '10px' }}
            >
                Lấy thông tin người dùng (/me)
            </button>
            <button
                onClick={refreshToken}
                style={{ padding: '10px 20px', marginTop: '20px' }}
            >
                Làm mới token (/refresh)
            </button>
        </div>
    );
};

export default Callback;