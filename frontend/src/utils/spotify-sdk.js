// src/utils/spotify-sdk.js
import { getToken } from "../api/auth";

const initializePlayer = async (callback) => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    console.error("Không tìm thấy refresh_token trong localStorage");
    return null;
  }

  try {
    const accessToken = await getToken(refreshToken);
    console.log("Access token từ getToken:", accessToken);

    const player = new window.Spotify.Player({
      name: "Music Player App",
      getOAuthToken: (cb) => {
        cb(accessToken);
      },
      volume: 0.5,
    });

    player.addListener("ready", ({ device_id }) => {
      console.log("Thiết bị sẵn sàng với Device ID:", device_id);
      callback(device_id);
    });

    player.addListener("not_ready", ({ device_id }) => {
      console.log("Thiết bị không sẵn sàng:", device_id);
    });

    player.addListener("player_state_changed", (state) => {
      if (state) {
        console.log("Trạng thái phát:", state);
      }
    });

    player.addListener("initialization_error", ({ message }) => {
      console.error("Lỗi khởi tạo:", message);
    });

    player.addListener("authentication_error", ({ message }) => {
      console.error("Lỗi xác thực:", message);
    });

    player.addListener("account_error", ({ message }) => {
      console.error("Lỗi tài khoản:", message);
    });

    player.connect().then((success) => {
      if (success) {
        console.log("Kết nối thành công với Web Playback SDK!");
      } else {
        console.error("Kết nối thất bại với SDK.");
      }
    });

    return player;
  } catch (error) {
    console.error("Lỗi khi khởi tạo player:", error.message);
    return null;
  }
};

export { initializePlayer };
