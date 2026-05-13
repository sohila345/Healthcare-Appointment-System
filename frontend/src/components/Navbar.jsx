import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import "../CSS/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // 🔥 دايمًا بياخد أحدث قيمة
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-md border-b shadow-sm md:px-10 px-4 flex items-center justify-between relative">

      {/* LOGO */}
      <div className="logo">
        <img
          src={assets.health2}
          alt="logo"
          className="w-28 sm:w-24 md:w-28 lg:w-32 "
        />
      </div>

      {/* LINKS */}
      <ul className="hidden md:flex gap-8 text-gray-600 font-medium text-sm">
        {[
          { name: "Home", path: "/" },
          { name: "Doctors", path: "/doctors" },
          { name: "Tips", path: "/tips" },
          { name: "DocAi", path: "/doc-ai" },
        ].map((item) => (
          <NavLink key={item.name} to={item.path}>
            <li className="hover:text-blue-600 transition duration-200 cursor-pointer">
              {item.name}
            </li>
          </NavLink>
        ))}
      </ul>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">

        <button className="md:hidden text-3xl text-gray-700" onClick={() => setOpen(!open)}>
          ☰
        </button>

        {/* USER */}
        {token ? (
          <div className="hidden md:flex items-center gap-3">

            <button
              onClick={() => navigate("/my-appointment")}
              className="text-sm px-3 py-1 rounded-lg hover:bg-gray-100 transition"
            >
              My Appointments
            </button>

            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1 rounded-lg text-red-500 hover:bg-red-50 transition"
            >
              Logout
            </button>

          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-md transition"
          >
            Create Account
          </button>
        )}
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="absolute top-[70px] left-0 w-full bg-white shadow-lg border-t flex flex-col items-center gap-5 py-6 md:hidden z-50">

          <NavLink to="/">Home</NavLink>
          <NavLink to="/doctors">Doctors</NavLink>
          <NavLink to="/tips">Tips</NavLink>
          <NavLink to="/doc-ai">DocAi</NavLink>

          <hr className="w-full" />

          {token ? (
            <>
              <p onClick={() => navigate("/my-appointment")} className="cursor-pointer">
                My Appointments
              </p>
              <p onClick={handleLogout} className="text-red-500 cursor-pointer">
                Logout
              </p>
            </>
          ) : (
            <button onClick={() => navigate("/login")}>
              Create Account
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;