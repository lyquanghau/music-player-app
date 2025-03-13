// middleware/checkToken.js
const axios = require("axios");
const Token = require("../models/Token");

const checkToken = async (req, res, next) => {
  try {
    let accessToken = req.headers.authorization?.split("Bearer ")[1]; // Lấy token từ header nếu có
    let tokenData; // Khai báo tokenData ở scope ngoài

    if (!accessToken) {
      console.log("No token in Authorization header, checking MongoDB...");
      tokenData = await Token.findOne().sort({ createdAt: -1 });
      if (!tokenData) {
        console.log("No token found in database");
        return res
          .status(401)
          .json({ error: "No token found. Please authenticate." });
      }

      accessToken = tokenData.accessToken;
      const expiresIn = tokenData.expiresIn;
      const createdAt = tokenData.createdAt;
      const currentTime = new Date();
      const tokenAge = (currentTime - createdAt) / 1000;

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

        accessToken = refreshResponse.data.access_token;
        const newExpiresIn = refreshResponse.data.expires_in;
        tokenData.accessToken = accessToken;
        tokenData.expiresIn = newExpiresIn;
        tokenData.createdAt = new Date();
        await tokenData.save();
        console.log("Token refreshed and saved");
      }
    }

    req.accessToken = accessToken;
    req.userId = tokenData?.userId; // tokenData có thể undefined nếu dùng header
    console.log("Proceeding with access token:", accessToken);
    next();
  } catch (error) {
    console.error("Error in checkToken middleware:", error);
    res.status(500).json({ error: "Failed to validate token" });
  }
};

module.exports = checkToken;
