const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) return res.status(401).json({ msg: "No token" });

  // Accept "Bearer <jwt>" (axios default) or raw JWT only
  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }
  token = token.trim();
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};