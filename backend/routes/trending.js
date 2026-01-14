const express = require("express");
const TrendingSong = require("../models/TrendingSong");

const router = express.Router();

/**
 * GET /api/trending?page=1&limit=5
 * 👉 CHỈ LẤY SNAPSHOT MỚI NHẤT
 */
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // 🔒 Lấy ngày mới nhất
    const latest = await TrendingSong.findOne()
      .sort({ snapshotDate: -1 })
      .select("snapshotDate");

    if (!latest) {
      return res.json({
        page,
        limit,
        total: 0,
        totalPages: 1,
        items: [],
      });
    }

    const snapshotDate = latest.snapshotDate;

    const [items, total] = await Promise.all([
      TrendingSong.find({ snapshotDate })
        .sort({ trendScore: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      TrendingSong.countDocuments({ snapshotDate }),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load trending" });
  }
});

/**
 * GET /api/trending/chart
 * 👉 CHART 7 NGÀY
 */
router.get("/chart", async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const data = await TrendingSong.aggregate([
      {
        $match: {
          snapshotDate: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            day: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$snapshotDate",
              },
            },
          },
          avgScore: { $avg: "$trendScore" },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    res.json(
      data.map((d) => ({
        day: d._id.day,
        score: Math.round(d.avgScore),
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Chart data error" });
  }
});

module.exports = router;
