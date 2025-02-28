import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);
    try {
      const response = await axios.get('http://localhost:8404/login', {
        withCredentials: true,
        maxRedirects: 0, // Không tự động redirect để kiểm tra
        validateStatus: status => status >= 200 && status < 400, // Cho phép 302 và 303
      });
      if (response.status === 302 || response.status === 303) {
        const redirectUrl = response.headers.location;
        console.log('Redirecting to:', redirectUrl);
        window.location.href = redirectUrl; // Thực hiện redirect thủ công
      }

    } catch (err) {
      console.log('Error details:', err); // Debug chi tiết
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