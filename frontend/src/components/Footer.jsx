import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 mt-20 border-t">

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* LOGO */}
        <div>
          <img
            className="mb-5 w-36 "
            src={assets.health2}
            alt="Clinic Logo"
          />
          <p className="text-gray-600 leading-6 text-sm">
            Trusted medical care for you and your family. We provide professional
            consultations and treatments with experienced doctors.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <p className="text-lg font-semibold mb-5 text-gray-800">CLINIC</p>
          <ul className="flex flex-col gap-2 text-gray-600 text-sm">
            <li className="hover:text-blue-600 transition cursor-pointer">Home</li>
            <li className="hover:text-blue-600 transition cursor-pointer">Doctors</li>
            <li className="hover:text-blue-600 transition cursor-pointer">Tips</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <p className="text-lg font-semibold mb-5 text-gray-800">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-sm text-gray-600">
            <li>📍 123 Health St, New Cairo, Egypt</li>
            <li>📞 +20 123 456 7890</li>
            <li>✉️ contact@medclinic.com</li>
          </ul>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-200 mt-8">
        <p className="text-center text-gray-500 text-sm py-4">
          &copy; {new Date().getFullYear()} Medical Clinic. All rights reserved.
        </p>
      </div>

    </footer>
  );
};

export default Footer;