const express = require("express");
const { body, validationResult } = require("express-validator");
const { authenticate, requireAdmin } = require("../middleware/auth");
const doctor = require("../controllers/doctor");
const upload = require("../middleware/upload");
const router = express.Router();
const Slot = require("../models/Slot");
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });
  next();
};

// ─── DOCTORS ──────────────────────────────────────────────────────────────────
router.post("/add", upload.single("image"), doctor.addDoctor);
router.get("/", doctor.listDoctors);
router.get("/:id", doctor.getDoctor);

// ─── SLOTS ────────────────────────────────────────────────────────────────────
// ➕ Add slots (date + time array)
router.post("/:id/slots", authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { slots } = req.body;

    // ✅ لازم يكون في slots
    if (!slots || !Array.isArray(slots)) {
      return res.status(400).json({
        success: false,
        message: "Slots array is required",
      });
    }

    // ✅ check duplicates
    for (let s of slots) {
      const exists = await Slot.findOne({
        doctor: id,
        date: s.date,
        time: s.time,
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: `Slot already exists at ${s.date} ${s.time}`,
        });
      }
    }

    await doctor.addSlots(id, slots);

    res.json({
      success: true,
      message: "Slots added successfully",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// 📥 Get slots
router.get("/:id/slots", doctor.getSlots);

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
router.post(
  "/:id/reviews",
  authenticate,
  [
    body("rating")
      .isNumeric()
      .custom((val) => val >= 1 && val <= 5),
    body("comment").notEmpty().withMessage("Comment is required."),
  ],
  validate,
  doctor.addReview
);
router.get("/:id/reviews",doctor.getDoctorReviews);
router.delete("/:id/reviews/:reviewId", authenticate, doctor.deleteReview);

module.exports = router;
