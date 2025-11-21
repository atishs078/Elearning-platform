import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Data from "../store/Data"; // Assuming Data.js provides the host URL
import Swal from 'sweetalert2';

const Signup = () => {
  const navigate = useNavigate();
  const { host } = Data(); // Get the API host URL

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { firstName, lastName, email, password } = formData;

    // 1. Prepare Payload: Combine first and last name into 'name'
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    const payload = {
      name,
      email,
      password,
    };

    try {
      // 2. API Call: POST /auth/register
      const res = await fetch(`${host}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle API errors (e.g., "Email Already Present")
        const errorMessage = data.message || data.error || "Registration failed.";
        throw new Error(errorMessage);
      }

      // 3. Success Handling
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'You can now log in with your new account.',
        confirmButtonText: 'Go to Login'
      }).then(() => {
      
        navigate("/student/login"); 
      });

    } catch (error) {
      console.error("Registration Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'An unexpected error occurred during registration.',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">

        <h2 className="text-4xl font-bold text-center mb-8 text-blue-700">
          Sign Up
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* First + Last Name Row */}
          <div className="w-full flex gap-4">

            {/* First Name */}
            <div className="flex flex-col w-1/2">
              <label className="text-base font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName" // Added name
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="First Name"
                className="mt-1 p-3 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col w-1/2">
              <label className="text-base font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName" // Added name
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Last Name"
                className="mt-1 p-3 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>

          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-base font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email" // Added name
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="mt-1 p-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-base font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password" // Added name
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="mt-1 p-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading} // Disable button while loading
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg
            font-semibold transition hover:bg-blue-700 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
            ) : (
                'Sign Up'
            )}
          </button>
        </form>

        {/* Bottom Section */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/student/login")}
            >
              Log In
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;