// index.js
require("dotenv").config(); // Chỉ gọi một lần
const express = require("express");
const connectDB = require("./db.js");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8404; // Thêm giá trị mặc định nếu PORT không được định nghĩa

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:6704",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
connectDB();
// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Music Player Backend - YouTube Version");
});

const apiRoutes = require("./routes/api");
const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");

app.use("/api", apiRoutes);
app.use("/", publicRoutes);
app.use("/api/auth", authRoutes);

// Xử lý lỗi chung
function handleError(error, res) {
  if (error.response) {
    console.log("Lỗi từ YouTube:", error.response.data);
    res.status(error.response.status).json(error.response.data);
  } else {
    console.log("Lỗi khác:", error.message);
    res.status(500).send("Lỗi: " + error.message);
  }
}

// Khởi động server
app.listen(port, () => {
  console.log(`Server chạy trên http://localhost:${port}`);
});
