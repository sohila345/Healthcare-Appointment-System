const express = require("express");
const { body, validationResult } = require("express-validator");
const { authenticate, requireAdmin } = require("../middleware/auth");
const { register, login, logout, getAllUsers, getUserById } = require("../controllers/user");

const router = express.Router();

// Helper: return validation errors early
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });
  next();
};

// ─── REGISTER ────────────────────────────────────────────────────────────────
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required.").trim(),
    body("email").isEmail().withMessage("Invalid email.").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
    body("phone").isLength( { min: 11, max: 11 } ).withMessage("Phone must be 11 numbers.").matches(/^(010|011|012|015)\d{8}$/)
    .withMessage("Phone number must start with 010, 011, 012, or 015 and be 11 digits.")
  ],
  validate,
  register
);

// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validate,
  login
);

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
router.post("/logout", logout);

// ─── GET ALL USERS (admin) ────────────────────────────────────────────────────
router.get("/", authenticate, requireAdmin, getAllUsers);

// ─── GET USER BY ID ───────────────────────────────────────────────────────────
router.get("/:id", authenticate, getUserById);

module.exports = router;