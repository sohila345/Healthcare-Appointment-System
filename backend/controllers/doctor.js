const Doctor = require("../models/Doctor");
const Slot = require("../models/Slot");
const Review = require("../models/Review");


// ➕ Add Doctor
exports.addDoctor = async (req, res) => {
  try {
    const count = await Doctor.countDocuments();

    if (count >= 13) {
      return res.status(400).json({
        success: false,
        message: "Cannot add more than 13 doctors.",
      });
    }

    const doctor = await Doctor.create({
      name: req.body.name,
      speciality: req.body.speciality,
      degree: req.body.degree,
      experience: req.body.experience,
      image: req.file ? req.file.filename : "",
    });

    res.status(201).json({
      success: true,
      doctor,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// 📥 Get Doctors
exports.listDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("slots reviews");
    res.json({ success: true, doctors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 📥 Get One Doctor
exports.getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("slots")
      .populate("reviews");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    res.json({ success: true, doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ➕ Add Slots
exports.addSlots = async (doctorId, slotsData) => {
  const slots = slotsData.map((s) => ({
    doctor: doctorId,
    date: s.date,       // YYYY-MM-DD
    time: s.time,       // "10:00 AM"
    isBooked: false,
    appointment: null,
  }));
  const createdSlots = await Slot.insertMany(slots);

  await Doctor.findByIdAndUpdate(doctorId, {
    $push: {
      slots: { $each: createdSlots.map((s) => s._id) },
    },
  });
};
// 📥 Get Slots
exports.getSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const filter = {
      doctor: id,
      date: date,
    };

    let slots = await Slot.find(filter);

    slots.sort((a, b) => {
      return new Date(`1970-01-01 ${a.time}`) - new Date(`1970-01-01 ${b.time}`);
    });

    res.json({
      success: true,
      slots,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.cleanExpiredSlots = async () => {
  const now = new Date();

  await Slot.updateMany(
    {
      date: { $lt: now.toISOString().split("T")[0] }
    },
    {
      isExpired: true,
      isBooked: false
    }
  );
};


// ➕ Add Review
exports.addReview = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    // ✅ لو موجود → update، لو مش موجود → create
    const existing = await Review.findOne({
      doctor: doctor._id,
      user: req.user._id,
    });
    let review;
    if (existing) {
      existing.rating  = req.body.rating;
      existing.comment = req.body.comment;
      await existing.save();
      review = existing;
    } else {
      review = await Review.create({
        doctor:   doctor._id,
        user:     req.user._id,
        userName: req.user.username,
        rating:   req.body.rating,
        comment:  req.body.comment,
      });
      doctor.reviews.push(review._id);
    }
    await doctor.save();
    await doctor.calcAverageRating();
    res.status(200).json({ success: true, review });
  } catch (err) {
    console.log("ERROR:", err); // ← ضيف دي
    res.status(500).json({ error: err.message });
  }
};

// ❌ Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    await Review.findByIdAndDelete(review._id);

    const doctor = await Doctor.findById(req.params.id);

    doctor.reviews = doctor.reviews.filter(
      (r) => r.toString() !== req.params.reviewId
    );

    await doctor.calcAverageRating();

    res.json({
      success: true,
      message: "Deleted",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDoctorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      doctor: req.params.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};