import { useEffect, useState } from "react";

const Player = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Lấy token từ localStorage để hiển thị trạng thái
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      setToken(refreshToken); // Chỉ để hiển thị trạng thái, không khởi tạo SDK ở đây
    }
  }, []);

  return (
    <div>Trình phát nhạc: {token ? "Đang kết nối..." : "Chưa có token"}</div>
  );
};

export default Player;
