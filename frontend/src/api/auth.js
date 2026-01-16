// src/api/auth.js
const API_URL = process.env.REACT_APP_API_URL;

/**
 * Xác thực token hiện tại (JWT)
 * Backend trả về user info hoặc token mới (nếu có)
 */
export const getToken = async (accessToken) => {
  if (!API_URL) {
    throw new Error("REACT_APP_API_URL is not defined");
  }

  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // Token hết hạn / không hợp lệ
    throw new Error(`Unauthorized (${response.status})`);
  }

  const data = await response.json();

  // Tùy backend: có thể trả user hoặc access_token mới
  return data.access_token || data;
};
