import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Data from "../store/Data";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const { host } = Data();
  const token = localStorage.getItem('authtoken')
  useEffect(() => {
    if (token){
      navigate('/student/dashboard')
    }
  
  }, [token, navigate])
  

  const [credential, setCredential] = useState({
    email: "",
    password: ""
  });

  const handelonChange = (e) => {
    setCredential({
      ...credential,
      [e.target.name]: e.target.value
    });
  };

  const handelLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(`${host}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credential.email,
        password: credential.password,
      }),
    });

    let jsonResponse = null;

    try {
      const text = await response.text();
      jsonResponse = text ? JSON.parse(text) : null;
    } catch (err) {
      console.log("⚠ Could not parse JSON:", err);
    }

    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: jsonResponse?.message || "Invalid email or password!",
        confirmButtonColor: "#d33",
      });
    } else {
   
      localStorage.setItem("authtoken",jsonResponse.token)
      localStorage.setItem("email",jsonResponse.email)
      localStorage.setItem("username",jsonResponse.name)
      localStorage.setItem("id",jsonResponse.id)
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        navigate("/student/dashboard");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="font-bold font-sans text-center mb-6 text-5xl text-black">
          Login
        </h2>

        <form className="space-y-5" onSubmit={handelLogin}>
          <div className="flex flex-col">
            <label className="text-lg font-medium text-black font-sans">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={credential.email}
              onChange={handelonChange}
              className="mt-1 p-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-sans text-lg"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-medium text-black font-sans">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={credential.password}
              onChange={handelonChange}
              className="mt-1 p-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-sans text-lg"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-lg text-blue-600 hover:text-blue-700 hover:underline font-sans"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-2xl font-sans
            font-semibold transition hover:bg-blue-700 shadow-md"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 font-sans">
            Don't have an account?{" "}
            <span
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/student/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
