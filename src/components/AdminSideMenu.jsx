import React, { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTasks,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBook,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaFolderOpen,
  FaUsersCog,
  FaSignOutAlt // Added FaSignOutAlt for professional logout look
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminSideMenu = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  // --- Menu Structure ---
  const menuSections = [
    {
      title: "Main",
      icon: FaHome,
      items: [{ name: "Home", path: "/admin/home", icon: FaHome }],
    },
    {
      title: "Course Management",
      icon: FaBook,
      color: "text-green-600",
      items: [
        { name: "Add Course", path: "/admin/addcourse", icon: FaPlus },
        { name: "Update Course", path: "/admin/updatecourse", icon: FaEdit },
        { name: "Delete Course", path: "/admin/deletecourse", icon: FaTrash },
      ],
    },
    {
      title: "Content & Assignments",
      icon: FaFolderOpen,
      color: "text-purple-600",
      items: [
        { name: "Add Assignment", path: "/admin/addassignment", icon: FaTasks },
        { name: "Add Lecture", path: "/admin/addlecture", icon: FaChalkboardTeacher },
        { name: "Update/Delete Lectures", path: "/admin/update-delete-lecture", icon: FaEdit },
      ],
    },
    {
      title: "Student Review",
      icon: FaUsersCog,
      color: "text-red-600",
      items: [
        { name: "Check Submissions", path: "/admin/check", icon: FaUserGraduate },
       
      ],
    },
  ];

  return (
    <div 
      className={`h-screen bg-gray-900 shadow-2xl ${open ? "w-60" : "w-20"} 
        transition-all duration-300 fixed left-0 top-0 z-50 font-sans text-white `}
    >

      {/* Header/Logo */}
      <div className="flex items-center p-4 pt-6 pb-2 justify-between">
        {open && (
            <h2 className="text-3xl font-extrabold text-indigo-400 tracking-wide transition duration-300">
                Admin Portal
            </h2>
        )}
        <button
          onClick={() => setOpen(!open)}
          className={`bg-indigo-600 text-white rounded-full p-2 shadow-lg hover:bg-indigo-700 transition ${!open && 'mx-auto'}`}
        >
          {open ? <FaChevronLeft size={14} /> : <FaChevronRight size={14} />}
        </button>
      </div>
      
      {/* 🛠️ FIX: Apply CSS to hide the scrollbar while keeping overflow-y-auto */}
      <div 
        className="flex flex-col gap-1 mt-6 overflow-y-auto custom-scrollbar-hide" 
        style={{ 
          maxHeight: 'calc(100vh - 100px)',
          // Apply custom styles directly for cross-browser scrollbar hiding:
          msOverflowStyle: 'none', /* IE and Edge */
          scrollbarWidth: 'none' /* Firefox */
        }}
      >
        
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="px-4">
            {/* Section Title/Divider */}
            {open && (
              <p className={`text-xs font-bold uppercase mt-4 mb-2 text-gray-500`}>
                {section.title}
              </p>
            )}

       
            {section.items.map((item, itemIndex) => (
              <div 
                key={itemIndex}
                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition duration-150 
                            hover:bg-indigo-800/70 hover:text-white ${!open && 'justify-center'}`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className={`text-xl ${item.color || 'text-indigo-400'}`} />
                {open && <span className="font-medium text-sm">{item.name}</span>}
              </div>
            ))}
          </div>
        ))}
        
        {/* Logout Link Placeholder for styling consistency */}
        <div 
            className="px-4 mt-6 mb-4"
            onClick={() => navigate("/logout")}
        >
            <div className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition duration-150 
                            hover:bg-red-800/70 text-red-300 ${!open && 'justify-center'}`}
            >
                <FaSignOutAlt className="text-xl" />
                {open && <span className="font-medium text-sm">Logout</span>}
            </div>
        </div>
        
      </div>
      
    </div>
  );
};

export default AdminSideMenu;