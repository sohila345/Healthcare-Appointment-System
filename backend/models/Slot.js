const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: String, // "2026-05-07"
    time: String, // "10:00 AM"

    isBooked: {
      type: Boolean,
      default: false,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slot", slotSchema);