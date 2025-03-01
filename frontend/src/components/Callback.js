import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
        } else {
            setError('Lỗi: Không nhận được token từ Spotify.');
        }
    }, [searchParams]);

    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!tokens) return <div>Đang xử lý...</div>;

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Đăng nhập thành công!</h2>
            <p>Access Token: {tokens.access_token.substring(0, 10)}...</p>
            <p>Refresh Token: {tokens.refresh_token.substring(0, 10)}...</p>
            <p>Expires in: {tokens.expires_in} seconds</p>
        </div>
    );
};

export default Callback;