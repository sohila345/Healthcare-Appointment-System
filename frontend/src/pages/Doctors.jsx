import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const navigate = useNavigate();
  const { doctorList } = useContext(AppContext);

  const specialties = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  useEffect(() => {
    if (!Array.isArray(doctorList)) return;

    let filtered = doctorList;

    if (speciality) {
      filtered = doctorList.filter((doc) => doc.speciality === speciality);
    }

    setFilterDoc(filtered);
  }, [doctorList, speciality]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <p className="text-gray-600 text-center sm:text-left mb-5">
        Browse through our specialist doctors
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar */}
        <div className="flex flex-col gap-3 text-sm sm:w-64">
          {specialties.map((spec, idx) => (
            <p
              key={idx}
              onClick={() =>
                speciality === spec
                  ? navigate("/doctors")
                  : navigate(`/doctors/${spec}`)
              }
              className={`w-full pl-4 py-2 border rounded-lg cursor-pointer transition-all text-gray-700 hover:bg-indigo-50 hover:text-black ${
                speciality === spec
                  ? "bg-indigo-100 text-black font-medium"
                  : ""
              }`}
            >
              {spec}
            </p>
          ))}

          <button
            onClick={() => navigate("/add-doctor")}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full font-medium transition-all"
          >
            Add Doctor
          </button>
        </div>

        {/* Doctors Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {filterDoc?.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full"
            >
              <img
                src={
                  item.image?.startsWith("http")
                    ? item.image
                    : `http://localhost:3000/upload/${item.image}`
                }
                alt={item.name}
                className="
  w-full
  h-52 sm:h-56 lg:h-60
  object-contain
  bg-white
  flex items-center justify-center
"
              />

              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-green-500 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <p>Available</p>
                </div>

                <p className="text-gray-900 text-xl font-semibold">
                  {item.name}
                </p>

                <p className="text-gray-600 text-base">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
