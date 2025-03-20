const express = require("express");
const connectDB = require("./db.js");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:6704",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"], // Thêm DELETE vào methods
    allowedHeaders: ["Content-Type"],
  })
);

app.options("*", cors());
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Music Player Backend - YouTube Version");
});

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

function handleError(error, res) {
  if (error.response) {
    console.log("Lỗi từ YouTube:", error.response.data);
    res.status(error.response.status).json(error.response.data);
  } else {
    console.log("Lỗi khác:", error.message);
    res.status(500).send("Lỗi: " + error.message);
  }
}

app.listen(port, () => {
  console.log(`Server chạy trên http://localhost:${port}`);
});
