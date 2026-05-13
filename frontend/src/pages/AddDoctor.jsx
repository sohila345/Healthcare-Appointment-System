import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const specialties = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

const AddDoctor = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [degree, setDegree] = useState("");
  const [experience, setExperience] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setPreview(URL.createObjectURL(file));
    setImage(file); // ✔️ ده صح
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
  
    if (!name || !image || !speciality || !degree || !experience) {
      setError("Please fill all fields");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      const formData = new FormData();
      formData.append("name", name);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("experience", experience);
      formData.append("image", image);
  
      const res = await fetch("http://localhost:3000/api/doctors/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
  
      navigate("/doctors");
  
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler}>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        
        <p className='text-2xl font-semibold'>Add New Doctor</p>
        <p>Please fill the doctor details below</p>

        {error && <p className='text-red-600 font-semibold'>{error}</p>}

        <div className='w-full'>
          <p>Full Name</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type='text'
            onChange={(e)=>setName(e.target.value)}
            value={name}
            required
          />
        </div>

        <div className='w-full'>
          <p>Upload Image</p>
          <input
            type='file'
            accept='image/*'
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            onChange={handleImageChange}
            required
          />

          {preview && (
            <img
              src={preview}
              className='w-24 h-24 mt-2 rounded-full object-cover'
              alt=""
            />
          )}
        </div>

        <div className='w-full'>
          <p>speciality</p>
          <select
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            value={speciality}
            onChange={(e)=>setSpeciality(e.target.value)}
            required
          >
            <option value="">Select Specialty</option>
            {specialties.map((s,i)=>(
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className='w-full'>
          <p>Degree</p>
          <input
            type='text'
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            value={degree}
            onChange={(e)=>setDegree(e.target.value)}
            required
          />
        </div>

        <div className='w-full'>
          <p>Experience</p>
          <input
            type='text'
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            value={experience}
            onChange={(e)=>setExperience(e.target.value)}
            required
          />
        </div>

        <button className='bg-primary text-white w-full py-2 rounded-md text-base'>
          Add Doctor
        </button>

      </div>
    </form>
  );
};

export default AddDoctor;