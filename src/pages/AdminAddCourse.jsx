import React, { useState } from "react";
import Swal from "sweetalert2";
import Data from "../store/Data";
import AdminSideMenu from "../components/AdminSideMenu";
import { FaPlusCircle, FaTrash, FaPlus } from "react-icons/fa";

const AdminAddCourse = () => {
  const { host } = Data();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [course, setCourse] = useState({
    title: "",
    shortDescription: "",
    description: "",
    category: "",
    price: "",
    thumbnailUrl: "",
  });

  const [lectures, setLectures] = useState([""]); 

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const addLecture = () => {
    setLectures([...lectures, ""]);
  };

  const handleLectureChange = (value, index) => {
    const updated = [...lectures];
    updated[index] = value;
    setLectures(updated);
  };

  const removeLecture = (index) => {
    const updated = lectures.filter((_, i) => i !== index);
    setLectures(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanLectures = lectures.filter(lec => lec && lec.trim() !== "");

    const payload = {
      ...course,
      price: parseFloat(course.price),
      lectures: cleanLectures,
    };
    
    try {
      const res = await fetch(`${host}/admin/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify(payload),
      });


      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Failed to create course" }));
        throw new Error(errorData.message || "Failed to create course");
      }

      const json = await res.json();

      Swal.fire({
        icon: "success",
        title: "Course Created Successfully!",
        text: `Course "${json.title}" has been added.`,
      });

      // Reset form
      setCourse({
        title: "",
        shortDescription: "",
        description: "",
        category: "",
        price: "",
        thumbnailUrl: "",
      });
      setLectures([""]);

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong",
      });
    }
  };

  const sidebarWidthClass = sidebarOpen ? "w-64" : "w-20";
  const marginClass = sidebarOpen ? "ml-64" : "ml-20";

  return (
    // 🎨 FIX 1: Apply bg-gray-900 background to the main container
    <div className="flex bg-gray-900 min-h-screen">
      
      {/* Admin Sidebar - Adjusting color to match dark theme if AdminSideMenu uses dynamic color based on parent */}
      <div className={`h-full fixed left-0 top-0 ${sidebarWidthClass} z-50`}>
        {/* NOTE: Ensure AdminSideMenu renders correctly (it should be dark already) */}
        <AdminSideMenu open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${marginClass} p-6 font-sans overflow-y-auto transition-all duration-300`}>

        {/* 🎨 FIX 2: Change title color to white for visibility */}
        <h1 className="text-3xl font-bold text-indigo-400 mb-6 ml-2 flex items-center gap-2">
            <FaPlusCircle className="text-indigo-400" /> Add New Course
        </h1>

        {/* 🎨 FIX 3: Keep form container white or light gray for contrast with inputs */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700 max-w-4xl mx-auto">

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Title */}
                <InputField 
                    label="Course Title" 
                    name="title" 
                    value={course.title} 
                    onChange={handleChange}
                    placeholder="Enter course title"
                    type="text"
                />

                {/* Short Description */}
                <InputField 
                    label="Short Description" 
                    name="shortDescription" 
                    value={course.shortDescription} 
                    onChange={handleChange}
                    placeholder="Short summary"
                    type="text"
                />
            </div>
            
            {/* Full Description */}
            <div>
              {/* 🎨 FIX 4: Change label text color to light gray/white */}
              <label className="font-semibold text-lg text-gray-300">Full Description</label>
              <textarea
                name="description"
                value={course.description}
                placeholder="Describe this course in detail"
                onChange={handleChange}
                rows="5"
                // 🎨 FIX 5: Adjust input styling for dark mode (white text, darker background)
                className="w-full mt-2 p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category */}
                <InputField 
                    label="Category" 
                    name="category" 
                    value={course.category} 
                    onChange={handleChange}
                    placeholder="Example: AI, Python"
                    type="text"
                />

                {/* Price */}
                <InputField 
                    label="Price (₹)" 
                    name="price" 
                    type="number"
                    value={course.price} 
                    onChange={handleChange}
                    placeholder="Enter course price"
                    
                />

          
                <InputField 
                    label="Thumbnail URL" 
                    name="thumbnailUrl" 
                    value={course.thumbnailUrl} 
                    onChange={handleChange}
                    placeholder="Add image URL"
                    type="text"
                />
            </div>


            {/* Lectures Section */}
            <div>
              {/* 🎨 FIX 4: Change label text color */}
              <label className="font-semibold text-lg text-gray-300">Lecture URLs / Titles</label>

              {lectures.map((lec, index) => (
                <div key={index} className="flex gap-3 mt-3 items-center">

                  <input
                    type="text"
                    value={lec}
                    onChange={(e) => handleLectureChange(e.target.value, index)}
                    placeholder={`Lecture ${index + 1} URL or Title`}
                    // 🎨 FIX 5: Adjust input styling for dark mode
                    className="flex-1 p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
                  />

                  {/* Remove */}
                  {lectures.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLecture(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-1"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              ))}

              {/* Add New Lecture */}
              <button
                type="button"
                onClick={addLecture}
                className="mt-3 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1"
              >
                <FaPlus size={12} /> Add Lecture
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl text-xl font-semibold hover:bg-indigo-700 shadow-md mt-6 transition"
            >
              Create Course
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};

// Reusable Input Component (Adjusted for dark mode compatibility)
const InputField = ({ label, name, value, onChange, placeholder, type = "text" }) => (
    <div>
        {/* 🎨 FIX 4: Change label text color */}
        <label className="font-semibold text-lg text-gray-300">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required
            // 🎨 FIX 5: Adjust input styling for dark mode
            className="w-full mt-2 p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
        />
    </div>
);

export default AdminAddCourse;