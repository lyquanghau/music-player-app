// middleware/checkToken.js
const axios = require("axios");
const Token = require("../models/Token");

// Middleware kiểm tra token
const checkToken = async (req, res, next) => {
  try {
    console.log("Checking token...");
    const tokenData = await Token.findOne().sort({ createdAt: -1 });
    console.log("Token data:", tokenData);
    if (!tokenData) {
      console.log("No token found");
      return res.status(401).json({ error: "No token found in database" });
    }

    let accessToken = tokenData.accessToken;
    const expiresIn = tokenData.expiresIn;
    const createdAt = tokenData.createdAt;
    const currentTime = new Date();
    const tokenAge = (currentTime - createdAt) / 1000; // Tuổi token tính bằng giây
    console.log("Token age:", tokenAge, "Expires in:", expiresIn);

    // Kiểm tra nếu token hết hạn
    if (tokenAge > expiresIn) {
      console.log("Token expired, refreshing...");
      const refreshToken = tokenData.refreshToken;
      const refreshResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        null,
        {
          params: {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString("base64")}`,
          },
        }
      );
      console.log("Refresh response:", refreshResponse.data);

      accessToken = refreshResponse.data.access_token;
      const newExpiresIn = refreshResponse.data.expires_in;

      // Cập nhật token mới vào MongoDB
      tokenData.accessToken = accessToken;
      tokenData.expiresIn = newExpiresIn;
      tokenData.createdAt = new Date();
      await tokenData.save();
      console.log("Token refreshed and saved");
    }

    req.accessToken = accessToken;
    req.userId = tokenData.userId; // Giả sử bạn lưu userId trong Token
    console.log("Proceeding with access token:", accessToken);
    next();
  } catch (error) {
    console.error("Error in checkToken middleware:", error);
    res.status(500).json({ error: "Failed to validate token" });
  }
};

module.exports = checkToken;
