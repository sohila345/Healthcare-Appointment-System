import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Tips from "./pages/Tips";
import DocAi from "./pages/DocAi";
import Appointment from "./pages/Appointment";
import AddDoctor from "./pages/AddDoctor";
import MyAppointments from "./pages/MyAppointments";
import ProtectedRoute from "./components/ProtectedRoutes";

import AppContextProvider from "./context/AppContext";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      const expiryTime = payload.exp * 1000;
      const now = Date.now();

      const timeout = expiryTime - now;

      if (timeout <= 0) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const timer = setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login");
      }, timeout);

      return () => clearTimeout(timer);
    } catch (err) {
      // لو التوكن corrupt
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <AppContextProvider>
      <div className="mx-4 sm:mx-[10%]">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/tips" element={<Tips />} />
          <Route path="/doc-ai" element={<DocAi />} />

          <Route
            path="/appointment/:docId"
            element={
              <ProtectedRoute>
                <Appointment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-appointment"
            element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-doctor"
            element={
              <ProtectedRoute>
                <AddDoctor />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </div>
    </AppContextProvider>
  );
};

export default App;