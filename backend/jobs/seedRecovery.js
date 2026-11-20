require("dotenv").config();
const mongoose = require("mongoose");
const TrendingSong = require("../models/TrendingSong");

async function seedRecovery() {
  const uri = process.env.RECOVERY_MONGO_URI;
  if (!uri || process.env.NODE_ENV === "production") throw new Error();
  const databaseName = "music_player_recovery";
  await mongoose.connect(uri, { dbName: databaseName, serverSelectionTimeoutMS: 10000 });
  const videoId = "M7lc1UVf-VE";
  const snapshotDate = new Date();
  snapshotDate.setHours(0, 0, 0, 0);
  await TrendingSong.updateOne({ videoId, snapshotDate }, { $setOnInsert: {
    videoId, snapshotDate, title: "YouTube Player API demo", artist: "YouTube",
    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`, trendScore: 1,
  } }, { upsert: true });
}

seedRecovery().catch(() => {
  console.error("Recovery fixture failed. Check the test MongoDB configuration.");
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());
