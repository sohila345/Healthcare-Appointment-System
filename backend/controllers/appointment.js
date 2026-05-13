const Appointment = require("../models/Appointment");
//const Doctor = require("../models/Doctor");
const Slot = require("../models/Slot");
// ─── BOOK APPOINTMENT ─────────────────────────────────────────────
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, slotId } = req.body;
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }
    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked",
      });
    }
    if (slot.isExpired) {
      return res.status(400).json({
        success: false,
        message: "Slot expired",
      });
    }
    const appointment = await Appointment.create({
      user: req.user._id,
      doctor: doctorId,
      slot: slotId,
      status: "confirmed",
    });
    slot.isBooked = true;
    slot.appointment = appointment._id;
    await slot.save();
    res.status(201).json({
      success: true,
      appointment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
// ─── GET ALL (ADMIN) ─────────────────────────────────────────────
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name speciality image")
      .populate("user", "name email")
      .populate("slot", "date time isBooked")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ─── GET SINGLE ──────────────────────────────────────────────────
exports.getAppointment = async (req, res) => {
  try {

    const appointments = await Appointment.find({ user: req.user._id })
    .populate("doctor", "name speciality image")
    .populate("slot", "date time isBooked isExpired")
    .sort({ createdAt: -1 });

    if (!appointments) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const isOwner = appointments.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorised.",
      });
    }

    res.json({
      success: true,
      appointments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ─── CANCEL APPOINTMENT ──────────────────────────────────────────
exports.cancelAppointment = async (req, res) => {
  try {

    const appointment = await Appointment.findById(
      req.params.id
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = "cancelled";

    await appointment.save();

    const slot = await Slot.findById(
      appointment.slot
    );

    if (slot) {
      slot.isBooked = false;
      slot.appointment = null;

      await slot.save();
    }

    res.json({
      success: true,
      message: "Appointment cancelled",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
///////////////////me////////////////

exports.getMyAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find({
      user: req.user._id,
      status: { $ne: "cancelled" },
    })
      .populate("doctor", "name speciality image")
      .populate("slot", "date time")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      appointments,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
