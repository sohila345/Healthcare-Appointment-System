const express = require("express");
const { body, validationResult } = require("express-validator");
const { authenticate, requireAdmin } = require("../middleware/auth");
const appointmentController = require("../controllers/appointment");

const router = express.Router();

// ✅ validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// ─── BOOK APPOINTMENT ─────────────────────────────────────────────
router.post(
  "/",
  authenticate,
  [
    body("doctorId").notEmpty().withMessage("Doctor ID is required."),
    body("slotId").notEmpty().withMessage("Slot ID is required."),
  ],
  validate,
  appointmentController.bookAppointment
);

// ─── GET ALL (ADMIN) ─────────────────────────────────────────────
router.get(
  "/",
  authenticate,
  requireAdmin,
  appointmentController.getAllAppointments
);

/////////////////////my APPOINTMENT///////////////////

router.get("/me", authenticate,appointmentController.getMyAppointments);


// ─── GET SINGLE APPOINTMENT ──────────────────────────────────────
router.get(
  "/:id",
  authenticate,
  appointmentController.getAppointment
);


// ─── CANCEL APPOINTMENT ──────────────────────────────────────────
router.patch(
  "/:id",
  authenticate,
  appointmentController.cancelAppointment
);
module.exports = router;