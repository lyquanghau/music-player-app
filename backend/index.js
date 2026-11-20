require("dotenv").config();
const express = require("express");
const connectDB = require("./db.js");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8404;

// ===== MIDDLEWARE =====
app.use(express.json());
const rateLimit = require("./middleware/rateLimit");
app.use("/api/auth", rateLimit(30, 60000));
app.use("/api/search", rateLimit(60, 60000));

const allowedOrigins = [
  "http://localhost:6704",
  "http://localhost:3000",
  "https://sky-music-lyquanghau.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép Postman / server-to-server
      if (!origin) return callback(null, true);

      // Cho phép tất cả subdomain của vercel.app
      if ((process.env.CORS_ORIGINS || "").split(",").map(value => value.trim()).includes(origin)) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight

// ===== DB =====
app.get("/ready", (req, res) => {
  const ready = require("mongoose").connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ ready });
});

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.send("Welcome to Music Player Backend - YouTube Version");
});

app.use("/api/trending", require("./routes/trending"));
app.use("/api", require("./routes/api"));
app.use("/", require("./routes/public"));
app.use("/api/auth", require("./routes/auth"));

// ===== JOB =====

// ===== START SERVER =====
async function start() {
  const missing = ["JWT_SECRET", "MONGO_URI", "YOUTUBE_API_KEY"].filter(name => !process.env[name]?.trim());
  if (missing.length) throw new Error(`Missing configuration: ${missing.join(", ")}`);
  await connectDB();
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

start().catch(error => {
  console.error(error.message.startsWith("Missing configuration:") ? error.message : "Database startup failed");
  process.exitCode = 1;
});
