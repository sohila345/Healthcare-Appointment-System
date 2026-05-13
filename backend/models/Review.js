const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);