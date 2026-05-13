import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (!data.token) {
        alert("Invalid response from server");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/");

    } catch (error) {
      alert("Server error or network issue");

    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        
        <p className='text-2xl font-semibold'>Login</p>

        <div className='w-full'>
          <p>Email</p>
          <input
            className='border rounded w-full p-2 mt-1'
            type='email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input
            className='border rounded w-full p-2 mt-1'
            type='password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
        </div>

        <button 
          disabled={loading}
          className='bg-primary text-white w-full py-2 rounded-md text-base'
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className='flex items-center justify-center m-auto'>
          <p>
            Create an Account: 
            <Link to="/signup" className="text-primary ml-1">SignUp</Link>
          </p>
        </div>

      </div>
    </form>
  );
};

export default Login;