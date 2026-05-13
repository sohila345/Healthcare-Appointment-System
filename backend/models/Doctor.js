const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    speciality: { type: String, required: true },
    experience: String,
    image: String,
    isActive: { type: Boolean, default: true },
    degree:{ type: String, required: true },
    slots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Slot" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],

    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

doctorSchema.methods.calcAverageRating = async function () {
  const Review = require("./Review");

  const reviews = await Review.find({ doctor: this._id });

  if (reviews.length === 0) {
    this.averageRating = 0;
  } else {
    this.averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }

  await this.save();
};

module.exports = mongoose.model("Doctor", doctorSchema);