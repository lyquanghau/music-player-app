// src/api/auth.js
export const getToken = async (refreshToken) => {
  try {
    const response = await fetch("http://localhost:8404/api/me", {
      // Sửa thành /api/me
      method: "GET",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Lỗi khi gọi API lấy token:", error.message);
    throw error;
  }
};
