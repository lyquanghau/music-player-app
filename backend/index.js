require("dotenv").config();
const express = require("express");
const connectDB = require("./db.js");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8404;

// ===== MIDDLEWARE =====
app.use(express.json());

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://sky-music-lyquanghau.vercel.app"]
    : ["http://localhost:6704"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 BẮT BUỘC cho preflight
app.options("*", cors());

// ===== DB =====
connectDB();

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.send("Welcome to Music Player Backend - YouTube Version");
});

app.use("/api/trending", require("./routes/trending"));
app.use("/api", require("./routes/api"));
app.use("/", require("./routes/public"));
app.use("/api/auth", require("./routes/auth"));

// ===== JOB =====
if (process.env.NODE_ENV === "production") {
  const fetchTrending = require("./jobs/fetchTrending");
  fetchTrending();
}

// ===== START SERVER =====
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
