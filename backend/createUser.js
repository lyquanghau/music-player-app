require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const connectDB = require("./db");
const User = require("./models/User");

async function createUser() {
  const username = process.env.SEED_USERNAME?.trim();
  const password = process.env.SEED_PASSWORD;
  if (!username || !password) throw new Error("Missing seed credentials");
  await connectDB();
  if (await User.exists({ username })) return;
  await User.create({ username, password: await bcrypt.hash(password, 10) });
}

createUser().catch(() => {
  console.error("Could not create seed user. Check configuration.");
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());
