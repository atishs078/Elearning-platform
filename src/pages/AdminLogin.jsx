import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Data from "../store/Data";
import Swal from "sweetalert2";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { host } = Data();

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
        title: "Admin Login Failed",
        text: jsonResponse?.message || "Invalid admin credentials!",
        confirmButtonColor: "#d33",
      });
    } else {
      localStorage.setItem("adminToken", jsonResponse.token);
      localStorage.setItem("adminEmail", jsonResponse.email);
      localStorage.setItem("adminName", jsonResponse.name);
      localStorage.setItem("adminId", jsonResponse.id);

      Swal.fire({
        icon: "success",
        title: "Welcome Admin!",
        text: "Redirecting to admin dashboard...",
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        navigate("/admin/home");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-300">

        {/* ADMIN TITLE */}
        <h2 className="font-bold font-sans text-center mb-8 text-4xl text-blue-700 tracking-wide">
          Admin Login
        </h2>

        <form className="space-y-5" onSubmit={handelLogin}>
          
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-lg font-medium text-black font-sans">
              Admin Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              name="email"
              value={credential.email}
              onChange={handelonChange}
              className="mt-1 p-3 border border-gray-300 rounded-lg font-sans text-md 
              focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-lg font-medium text-black font-sans">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter admin password"
              name="password"
              value={credential.password}
              onChange={handelonChange}
              className="mt-1 p-3 border border-gray-300 rounded-lg font-sans text-md 
              focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-lg text-xl font-sans
            font-semibold transition hover:bg-blue-800 shadow-md"
          >
            Login as Admin
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;
