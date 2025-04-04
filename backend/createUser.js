// createUser.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB (music_player)");

    // Kiểm tra user tồn tại
    const username = "huonggiang";
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return;
    }
    // Tạo user mới
    const hashedPassword = await bcrypt.hash("123456789", 10);
    const user = await User.create({
      username,
      password: hashedPassword,
    });
    console.log("User created in music_player:", user);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
    console.log("Connection closed");
  }
}

createUser();
