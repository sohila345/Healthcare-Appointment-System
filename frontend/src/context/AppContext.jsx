import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

  const [doctorList, setDoctorList] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/doctors");
        const data = await res.json();

        console.log("Doctors API:", data);

        // لو الباك بيرجع array مباشرة
        if (Array.isArray(data)) {
          setDoctorList(data);
        }

        // لو بيرجع { doctors: [] }
        else if (Array.isArray(data.doctors)) {
          setDoctorList(data.doctors);
        }

        else {
          setDoctorList([]);
        }

      } catch (err) {
        console.log("Fetch error:", err);
        setDoctorList([]);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <AppContext.Provider value={{
      doctorList,
      setDoctorList,
      appointments,
      setAppointments,
      user,
      setUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;