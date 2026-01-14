const axios = require("axios");
const TrendingSong = require("../models/TrendingSong");

const YT_API = "https://www.googleapis.com/youtube/v3/videos";

async function fetchTrending() {
  const { data } = await axios.get(YT_API, {
    params: {
      part: "snippet,statistics",
      chart: "mostPopular",
      regionCode: "VN",
      videoCategoryId: "10",
      maxResults: 50,
      key: process.env.YOUTUBE_API_KEY,
    },
  });

  // ===== CHUẨN HÓA NGÀY =====
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (const item of data.items) {
    const views = Number(item.statistics.viewCount || 0);
    const likes = Number(item.statistics.likeCount || 0);
    const comments = Number(item.statistics.commentCount || 0);

    const trendScore = views * 0.5 + likes * 0.3 + comments * 0.2;

    // ===== LẤY SNAPSHOT HÔM QUA =====
    const yesterdayDoc = await TrendingSong.findOne({
      videoId: item.id,
      snapshotDate: yesterday,
    }).lean();

    let change = 0;

    if (yesterdayDoc && yesterdayDoc.trendScore > 0) {
      change =
        ((trendScore - yesterdayDoc.trendScore) / yesterdayDoc.trendScore) *
        100;

      // làm tròn 1 chữ số
      change = Math.round(change * 10) / 10;
    }

    // ===== UPSERT SNAPSHOT HÔM NAY =====
    await TrendingSong.updateOne(
      {
        videoId: item.id,
        snapshotDate: today,
      },
      {
        $set: {
          videoId: item.id,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails?.medium?.url,

          viewCount: views,
          likeCount: likes,
          commentCount: comments,

          trendScore,
          change,
          snapshotDate: today,
        },
      },
      { upsert: true }
    );
  }

  console.log("✅ Trending snapshot + change% saved");
}

module.exports = fetchTrending;
