import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  username: name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("backend response:", data);
      
        const errorMsg =
          data?.errors?.[0]?.msg || "Error occurred";
      
        alert(errorMsg);
        return;
      }

      navigate("/login");

    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler}>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        
        <p> Please sign up to book appointment </p>

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
          <p>Email</p>
          <input 
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type='email'
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        
        <div className='w-full'>
          <p>Phone</p>
          <input 
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type='text'
            onChange={(e)=>setPhone(e.target.value)}
            value={phone}
            required
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input 
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type='password'
            onChange={(e)=>setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button 
          disabled={loading}
          className='bg-primary text-white w-full py-2 rounded-md text-base'
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <div className='flex items-center text-center justify-center m-auto'>
          <p>
            Already Have an Account: <Link to="/login">Login</Link>
          </p>
        </div>

      </div>
    </form>
  );
};

export default SignUp;