const jwt  = require("jsonwebtoken");
const User = require("../models/User");
const { ACCESS_TOKEN_SECRET } = require("../config/config");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ error: "No token provided. Please log in." });

  try {
    const token   = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res.status(401).json({ error: "User no longer exists." });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ error: "Admin access required." });
  next();
};

module.exports = { authenticate, requireAdmin };