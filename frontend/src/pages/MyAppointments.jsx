import React, { useEffect, useState } from "react";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/appointments/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        // ✅ اخفى cancelled
        const filtered = data.appointments.filter(
          (item) => item.status !== "cancelled"
        );

        setAppointments(filtered);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ================= CANCEL =================
  const cancelAppointment = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/api/appointments/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      // ✅ يختفى فوراً
      setAppointments((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mt-10 px-5">
      <p className="text-3xl font-bold mb-10">My Appointments</p>

      {appointments.length === 0 ? (
        <p>No Appointments</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ">
          {appointments.map((item) => (
            <div
              key={item._id}
              className="border rounded-xl overflow-hidden shadow transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]"
            >
              <img
                src={`http://localhost:3000/upload/${item.doctor?.image}`}
                className="w-full h-52 object-contain bg-gray-50"
                alt=""
              />

              <div className="p-5">
                <p className="text-xl font-bold">{item.doctor?.name}</p>

                <p className="text-gray-500">{item.doctor?.speciality}</p>

                <p className="mt-3">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(item.slot?.date).toDateString()}
                </p>

                <p>
                  <span className="font-semibold">Time:</span> {item.slot?.time}
                </p>

                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="mt-5 border border-red-500 text-red-500 px-5 py-2 rounded-lg hover:bg-red-500 hover:text-white"
                >
                  Cancel Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
