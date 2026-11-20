const axios = require("axios");
const TrendingSong = require("../models/TrendingSong");

const YT_API = "https://www.googleapis.com/youtube/v3/videos";

async function fetchTrending() {
  const { data } = await axios.get(YT_API, {
    timeout: 15000,
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

  const previous = await TrendingSong.find({
    videoId: { $in: data.items.map(item => item.id) },
    snapshotDate: yesterday,
  }).select("videoId trendScore").lean();
  const previousById = new Map(previous.map(song => [song.videoId, song]));

  const updates = data.items.map(item => {
    const views = Number(item.statistics.viewCount || 0);
    const likes = Number(item.statistics.likeCount || 0);
    const comments = Number(item.statistics.commentCount || 0);

    const trendScore = views * 0.5 + likes * 0.3 + comments * 0.2;

    // ===== LẤY SNAPSHOT HÔM QUA =====
    const yesterdayDoc = previousById.get(item.id);

    let change = 0;

    if (yesterdayDoc && yesterdayDoc.trendScore > 0) {
      change =
        ((trendScore - yesterdayDoc.trendScore) / yesterdayDoc.trendScore) *
        100;

      // làm tròn 1 chữ số
      change = Math.round(change * 10) / 10;
    }

    // ===== UPSERT SNAPSHOT HÔM NAY =====
    return { updateOne: {
      filter: {
        videoId: item.id,
        snapshotDate: today,
      },
      update: {
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
      upsert: true,
    } };
  });
  if (updates.length) await TrendingSong.bulkWrite(updates);

  console.log("✅ Trending snapshot + change% saved");
}

module.exports = fetchTrending;

if (require.main === module) {
  require("dotenv").config();
  const mongoose = require("mongoose");
  const connectDB = require("../db");
  Promise.resolve().then(async () => {
    if (!process.env.YOUTUBE_API_KEY) throw new Error("Missing configuration");
    await connectDB();
    await fetchTrending();
  }).catch(() => {
    console.error("Trending sync failed. Check database connectivity and YouTube configuration.");
    process.exitCode = 1;
  }).finally(() => mongoose.disconnect());
}
