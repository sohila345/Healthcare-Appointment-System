import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctorList } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  // ================= GET DOCTOR =================
  useEffect(() => {
    if (!doctorList) return;

    const doctor = doctorList.find((d) => String(d._id) === String(docId));

    if (doctor) {
      setDocInfo(doctor);
      setReviews(doctor.reviews, []);
    }
  }, [doctorList, docId]);

  // ================= FETCH SLOTS =================
  const fetchSlots = async () => {
    try {
      const today = new Date();
      const todayIndex = today.getDay();

      let diff = selectedDay - todayIndex;
      if (diff < 0) diff += 7;

      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + diff);

      const formattedDate = targetDate.toISOString().split("T")[0];

      const res = await fetch(
        `http://localhost:3000/api/doctors/${docId}/slots?date=${formattedDate}`
      );

      const data = await res.json();

      if (data.success) {
        const availableSlots = data.slots.filter(
          (slot) => !slot.isBooked && !slot.isExpired
        );

        setSlots(availableSlots);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDay, docId]);

  // ================= BOOK =================
  const bookAppointment = async () => {
    try {
      setErrorMsg("");
      setSuccessMsg("");

      if (!selectedSlotId) {
        setErrorMsg("Please select a slot");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);

      const res = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: docId,
          slotId: selectedSlotId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message, "Booking failed");
      }

      setSuccessMsg("Appointment booked successfully");

      // ✅ يختفى من الصفحة فوراً
      setSlots((prev) => prev.filter((slot) => slot._id !== selectedSlotId));

      setSelectedSlotId(null);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= REVIEW =================
  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/doctors/${docId}/reviews`
      );
  
      const data = await res.json();
  
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    fetchReviews();
  }, [docId]);
  
  const handlePostComment = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        navigate("/login");
        return;
      }
  
      const res = await fetch(
        `http://localhost:3000/api/doctors/${docId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
            comment: newComment,
          }),
        }
      );
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message);
      }
  
      // تحديث الريفيوهات من الداتابيز
      await fetchReviews();
  
      setNewComment("");
      setRating(0);
      setErrorMsg("");
  
    } catch (err) {
      setErrorMsg(err.message);
    }
  };
  
  if (!docInfo) {
    return <p className="text-center mt-20">Loading...</p>;
  }
  return (
    <div className="mt-10">
      {/* Doctor */}
      <div className="flex gap-10 items-start flex-col sm:flex-row">
        <img
          src={
            docInfo.image?.startsWith("http")
              ? docInfo.image
              : `http://localhost:3000/upload/${docInfo.image}`
          }
          className="w-72 rounded-xl bg-blue-100"
          alt=""
        />

        <div>
          <p className="text-3xl font-bold">{docInfo.name}</p>

          <p className="mt-2 text-gray-600">
            {docInfo.degree} - {docInfo.speciality}
          </p>

          <p className="mt-2 text-gray-500">{docInfo.experience}</p>
        </div>
      </div>

      {/* Days */}
      <div className="flex gap-3 mt-10 overflow-x-auto">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => setSelectedDay(index)}
            className={`px-5 py-2 rounded-full border ${
              selectedDay === index ? "bg-primary text-white" : ""
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Slots */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-8">
        {slots.length === 0 ? (
          <p>No Available Slots</p>
        ) : (
          slots.map((slot) => (
            <button
              key={slot._id}
              onClick={() => setSelectedSlotId(slot._id)}
              className={`border rounded-full py-2 ${
                selectedSlotId === slot._id ? "bg-primary text-white" : ""
              }`}
            >
              {slot.time}
            </button>
          ))
        )}
      </div>

      {/* Button */}
      <button
        onClick={bookAppointment}
        disabled={loading}
        className="bg-primary text-white px-10 py-3 rounded-full mt-8"
      >
        {loading ? "Booking..." : "Book"}
      </button>

      {errorMsg && <p className="text-red-500 mt-3">{errorMsg}</p>}

      {successMsg && <p className="text-green-500 mt-3">{successMsg}</p>}

      {/* Reviews */}
      <div className="mt-14">
        <p className="text-2xl font-bold mb-5">Reviews</p>

        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`text-3xl cursor-pointer ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write review..."
            className="border flex-1 p-3 rounded-lg"
          />

          <button
            onClick={handlePostComment}
            className="bg-primary text-white px-5 rounded-lg"
          >
            Post
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {reviews.map((rev) => (
            <div key={rev._id} className="border rounded-xl p-4 flex gap-3">
              <img
                src={assets.upload_area}
                className="w-12 h-12 rounded-full"
                alt=""
              />

              <div>
                <p className="font-bold">{rev.userName}</p>

                <p className="text-yellow-400">{"★".repeat(rev.rating)}</p>
                <p>{rev.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointment;
