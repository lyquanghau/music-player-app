function rateLimit(maxRequests, intervalMs) {
  const counts = new Map();
  let resetAt = 0;
  return (req, res, next) => {
    const now = Date.now();
    if (now >= resetAt) {
      counts.clear();
      resetAt = now + intervalMs;
    }
    const count = counts.get(req.ip) || 0;
    if (count >= maxRequests) {
      res.set("Retry-After", String(Math.ceil((resetAt - now) / 1000)));
      return res.status(429).json({ message: "Vui lòng thử lại sau." });
    }
    counts.set(req.ip, count + 1);
    next();
  };
}

module.exports = rateLimit;
