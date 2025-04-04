// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userFound = await User.findOne({ username });
    if (!userFound || !(await bcrypt.compare(password, userFound.password))) {
      return res.status(401).json({ message: "Sai thông tin đăng nhập" });
    }
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return res.status(500).json({ error: "JWT secret key is not defined" });
    }
    const token = jwt.sign({ id: userFound._id }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Tên người dùng đã tồn tại" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
