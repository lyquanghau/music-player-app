// src/utils/spotify-sdk.js
import { getToken } from "../api/auth";

const initializeToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    console.log("Refresh token từ localStorage:", refreshToken);
    if (!refreshToken) {
      throw new Error("Không tìm thấy refresh_token trong localStorage");
    }
    const accessToken = await getToken(refreshToken);
    console.log("Access token từ getToken:", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Lỗi khi lấy token:", error.message);
    throw error;
  }
};

const initializePlayer = (accessToken) => {
  console.log("Khởi tạo Spotify Player với token:", accessToken);
  const spotifyPlayer = new window.Spotify.Player({
    name: "Music Player App",
    getOAuthToken: (cb) => {
      cb(accessToken);
    },
    volume: 0.5,
  });

  spotifyPlayer.addListener("ready", ({ device_id }) => {
    console.log("Thiết bị sẵn sàng với Device ID:", device_id);
  });

  spotifyPlayer.addListener("not_ready", ({ device_id }) => {
    console.log("Thiết bị không sẵn sàng:", device_id);
  });

  spotifyPlayer.addListener("player_state_changed", (state) => {
    if (state) {
      console.log("Trạng thái phát:", state);
    }
  });

  spotifyPlayer
    .connect()
    .then((success) => {
      if (success) {
        console.log("Kết nối thành công với Web Playback SDK!");
      } else {
        console.log("Kết nối thất bại.");
      }
    })
    .catch((error) => {
      console.error("Lỗi khi kết nối:", error);
    });

  return spotifyPlayer;
};

window.onSpotifyWebPlaybackSDKReady = async () => {
  console.log("Web Playback SDK đã sẵn sàng (gọi từ SDK)!");
  try {
    const accessToken = await initializeToken();
    initializePlayer(accessToken);
  } catch (error) {
    console.error("Lỗi khi khởi tạo player:", error.message);
  }
};

export { initializePlayer };
