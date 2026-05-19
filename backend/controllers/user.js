const User      = require("../models/User");
const bcrypt    = require("bcryptjs");
//const jwt       = require("jsonwebtoken");
const validator = require("validator");
const { generateTokens } = require("../middleware/token");

// ─── REGISTER ────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { username, password,phone  } = req.body;
    const email = req.body.email?.toLowerCase().trim();

    if (!validator.isEmail(email))
      return res.status(400).json({ success: false, message: "Invalid email address." });

    if (!password || password.length < 8)
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    
    if (!phone || phone.length < 11)
      return res.status(400).json({ success: false, message: "Phone must be at least 11 numbers." });



    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists)
      return res.status(409).json({ success: false, message: "Email or username already in use." });

    // NOTE: hash req.body.password (not the already-lowercased email variable)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      
      role: req.body.role || "user",
      phone
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ success: true, user: userObj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid email or password." });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(400).json({ success: false, message: "Invalid email or password." });

    const { accessToken, refreshToken } = generateTokens(user);

    res.json({ success: true, message: "Login successful.", accessToken,
      refreshToken, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
// Stateless JWT: client should discard the token.
// For true server-side revocation, consider a token blocklist.
const logout = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      refreshToken: null
    });

    res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET ALL USERS (admin) ────────────────────────────────────────────────────
const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET USER BY ID ───────────────────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found." });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, logout, getAllUsers, getUserById };