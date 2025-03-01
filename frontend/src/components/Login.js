import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);
    try {
      const response = await axios.get('http://localhost:8404/login', {
        withCredentials: true,
      });
      const { url } = response.data;
      console.log('Redirecting to:', url);
      window.location.href = url; // Chuyển hướng tới Spotify
    } catch (err) {
      console.log('Error details:', err);
      setError('Lỗi khi gửi request: ' + (err.response ? err.response.data.error : err.message || 'Network Error'));
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Đăng nhập với Spotify</h2>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Đăng nhập
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;