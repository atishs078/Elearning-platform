import React from "react";
import { 
  FaHome, 
  FaSearch, 
  FaBook, 
  FaTasks, 
  FaUser, 
  FaRegBookmark,
  FaSignOutAlt, // Using FaSignOutAlt (or IoLogOut if preferred)
  FaGraduationCap // New icon for a student focus
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SideMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/student/dashboard", icon: FaHome, isPrimary: true },
    { name: "Search Courses", path: "/search", icon: FaSearch, isPrimary: true },
    { name: "My Courses", path: "/mycourses", icon: FaRegBookmark, isPrimary: false },
    { name: "Assignments", path: "/assignment", icon: FaTasks, isPrimary: false },
    { name: "Profile", path: "/profile", icon: FaUser, isPrimary: false },
  ];

  return (
    <div className="min-h-screen w-64 bg-gray-900 shadow-2xl p-6 font-sans border-r border-gray-700 text-white ">
      
      <h2 className="text-3xl font-extrabold mb-10 text-indigo-400 tracking-wide">
        eLearning
      </h2>

      <div className="flex flex-col gap-1 text-md">
 
        <p className="text-xs font-bold uppercase mt-2 mb-2 text-gray-500">
            Navigation
        </p>

        {menuItems.filter(item => item.isPrimary).map((item, index) => (
            <div 
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition duration-150 bg-indigo-800/20 hover:bg-indigo-700/50 font-medium font-sans text-lg"
                onClick={() => navigate(item.path)}
            >
                <item.icon className="text-indigo-400 text-xl" />
                <span>{item.name}</span>
            </div>
        ))}
        
        {/* --- Learning & Account Section --- */}
        <p className="text-xs font-bold uppercase mt-6 mb-2 text-gray-500">
            Learning & Account
        </p>

        {menuItems.filter(item => !item.isPrimary).map((item, index) => (
            <div 
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition duration-150 hover:bg-gray-700/50 text-gray-300 font-sans text-md"
                onClick={() => navigate(item.path)}
            >
                <item.icon className="text-xl text-gray-400" />
                <span>{item.name}</span>
            </div>
        ))}

      
        <p className="text-xs font-bold uppercase mt-8 mb-2 text-gray-500">
            System
        </p>
        <div 
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition duration-150 bg-red-800/20 hover:bg-red-700/50 text-red-300 font-medium"
            onClick={() => navigate("/logout")}
        >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
        </div>

      </div>
    </div>
  );
};

export default SideMenu;