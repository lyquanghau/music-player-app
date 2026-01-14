require("dotenv").config();
const express = require("express");
const connectDB = require("./db.js");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8404;

const trendingRoutes = require("./routes/trending");
const fetchTrending = require("./jobs/fetchTrending");

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:6704",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

// ===== DB =====
connectDB();

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.send("Welcome to Music Player Backend - YouTube Version");
});

app.use("/api/trending", trendingRoutes); // ✅ FIXED

const apiRoutes = require("./routes/api");
const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");

app.use("/api", apiRoutes);
app.use("/", publicRoutes);
app.use("/api/auth", authRoutes);

// ===== FETCH TRENDING =====
fetchTrending();

// ===== START SERVER =====
app.listen(port, () => {
  console.log(`Server chạy trên http://localhost:${port}`);
});
