const axios = require("axios");

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

/**
 * Lấy nhạc trending (music category)
 */
async function getTrendingMusicFromYoutube() {
  // 1️⃣ Lấy danh sách video trending
  const trendingRes = await axios.get(`${BASE_URL}/videos`, {
    params: {
      part: "snippet,contentDetails",
      chart: "mostPopular",
      regionCode: "VN",
      videoCategoryId: "10", // 🎵 Music
      maxResults: 25,
      key: YOUTUBE_API_KEY,
    },
  });

  const videos = trendingRes.data.items || [];

  // 2️⃣ Map về format gọn cho frontend
  return videos.map((v) => {
    const duration = parseDurationToSeconds(v.contentDetails.duration);

    return {
      id: v.id,
      title: v.snippet.title,
      channel: v.snippet.channelTitle,
      thumbnail:
        v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url,
      duration, // seconds
    };
  });
}

/**
 * ISO 8601 → seconds (PT4M13S → 253)
 */
function parseDurationToSeconds(iso) {
  const match = iso.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const minutes = parseInt(match?.[1] || 0);
  const seconds = parseInt(match?.[2] || 0);
  return minutes * 60 + seconds;
}

module.exports = {
  getTrendingMusicFromYoutube,
};
