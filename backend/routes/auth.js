const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const user = [
  {
    id: 1,
    username: "hau",
    password: "123456",
  },
];

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const userFound = user.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Sai thông tin đăng nhập" });
  }

  // Lấy secret key từ biến môi trường
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    return res.status(500).json({ error: "JWT secret key is not defined" });
  }

  const token = jwt.sign({ id: userFound.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

router.get("/register", (req, res) => {
  const { username, password } = req.body;
  users.push.push({
    id: user.length + 1,
    username,
    password,
  });
  res.status(201).json({ message: "Đăng ký thành công" });
});

module.exports = router;
