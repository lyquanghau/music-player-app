const checkApiKey = (req, res, next) => {
  if (!process.env.YOUTUBE_API_KEY) {
    return res
      .status(500)
      .json({ error: "YOUTUBE_API_KEY không được cấu hình" });
  }
  next();
};

module.exports = checkApiKey;
