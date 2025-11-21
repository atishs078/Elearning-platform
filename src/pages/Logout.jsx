import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Clear Local Storage Authentication Items
    localStorage.removeItem("authtoken"); // Student/User Token
    localStorage.removeItem("adminToken"); // Admin Token (if separate)
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    // 2. Display optional confirmation message
    Swal.fire({
      icon: 'success',
      title: 'Logged Out!',
      text: 'You have been successfully logged out.',
      timer: 1500, // Display for 1.5 seconds
      showConfirmButton: false,
    });

    // 3. Redirect the user to the login or home page
    // Assuming '/login' is your application's sign-in route
    const redirectTimer = setTimeout(() => {
        navigate('/student/login'); 
    }, 1500); 

    // Cleanup function to clear the timer if the component unmounts unexpectedly
    return () => clearTimeout(redirectTimer);
    
  }, [navigate]); // navigate is a dependency of useEffect

  // Render a simple message while the process completes
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-xl font-semibold text-gray-700">
        Logging out... 🚪
      </div>
    </div>
  );
};

export default Logout;