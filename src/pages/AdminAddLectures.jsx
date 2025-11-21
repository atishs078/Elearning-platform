import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Data from "../store/Data";
import AdminSideMenu from "../components/AdminSideMenu";
import { FaVideo, FaBook, FaListOl, FaClock, FaCalendarAlt } from "react-icons/fa"; // Added FaCalendarAlt for better field context
import { FaLink } from "react-icons/fa";
const AdminAddLectures = () => {
  const { host } = Data();
  
  const [sidebarOpen, setSidebarOpen] = useState(true); // State for alignment
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [lecture, setLecture] = useState({
    courseId: "", 
    title: "",
    description: "",
    videoUrl: "",
    durationSec: 0, 
    orderIndex: 1, 
  });

  // Fetch list of courses
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${host}/courses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch courses");

      const json = await res.json();
      setCourses(json);
      setLoading(false);

      if (json.length > 0) {
          setLecture(prev => ({ ...prev, courseId: json[0].id }));
      }

    } catch (err) {
      console.error("Course fetch error:", err);
      setLoading(false);
      Swal.fire("Error", "Could not load courses.", "error");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [host]);

  const handleChange = (e) => {
    setLecture({ ...lecture, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lecture.courseId) {
        Swal.fire("Error", "Please select a course.", "warning");
        return;
    }

    const payload = {
        ...lecture,
        durationSec: parseInt(lecture.durationSec),
        orderIndex: parseInt(lecture.orderIndex),
    };

    try {
      const res = await fetch(`${host}/admin/lectures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Lecture creation failed. Server response: ${errorText.substring(0, 100)}...`);
      }

      const json = await res.json();

      Swal.fire({
        icon: "success",
        title: "Lecture Added!",
        text: `Lecture "${json.title}" successfully added to the course.`,
        timer: 2000,
        showConfirmButton: false,
      });

      setLecture(prev => ({ 
          ...prev, 
          title: "", 
          description: "", 
          videoUrl: "", 
          durationSec: 0, 
          orderIndex: (prev.orderIndex + 1) || 1
      }));

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Creation Failed",
        text: err.message,
      });
    }
  };

  const sidebarWidthClass = sidebarOpen ? "w-64" : "w-20";
  const marginClass = sidebarOpen ? "ml-64" : "ml-20";

  return (
    // 🎨 FIX 1: Apply bg-gray-900 background
    <div className="flex bg-gray-900 min-h-screen">

      {/* Sidebar */}
      <div className={`h-full fixed left-0 top-0 ${sidebarWidthClass} z-50`}>
        <AdminSideMenu open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${marginClass} p-6 font-sans overflow-y-auto transition-all duration-300`}>

        {/* 🎨 FIX 2: Light title color and Indigo accent */}
        <h1 className="text-3xl font-bold text-indigo-400 mb-8 flex items-center gap-2">
            <FaVideo className="text-indigo-400" /> Add New Lecture
        </h1>
        
        {/* 🎨 FIX 3: Dark container background */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-3xl mx-auto border border-gray-700">
            
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Course Selection */}
                <div>
                    {/* 🎨 FIX 4: Light label color */}
                    <label htmlFor="courseId" className="font-semibold text-lg flex items-center mb-1 text-gray-300">
                        <FaBook className="mr-2 text-indigo-400" /> Select Course
                    </label>
                    {loading ? (
                        <div className="p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-400">Loading courses...</div>
                    ) : courses.length === 0 ? (
                        <div className="p-3 border border-red-500 rounded-lg bg-red-900/20 text-red-400">No courses available. Add a course first.</div>
                    ) : (
                        <select
                            id="courseId"
                            name="courseId"
                            value={lecture.courseId}
                            onChange={handleChange}
                            // 🎨 FIX 5: Dark select styling
                            className="w-full mt-1 p-3 border border-gray-600 rounded-lg appearance-none bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Title */}
                <InputField 
                    label="Lecture Title" 
                    name="title" 
                    value={lecture.title} 
                    handleChange={handleChange} 
                    required={true}
                    icon={<FaVideo />}
                />

                {/* Description */}
                <TextAreaField 
                    label="Short Description" 
                    name="description" 
                    value={lecture.description} 
                    handleChange={handleChange} 
                    required={true}
                />
                
                {/* Video URL */}
                <InputField 
                    label="Video URL (e.g., YouTube Link)" 
                    name="videoUrl" 
                    value={lecture.videoUrl} 
                    handleChange={handleChange} 
                    required={true}
                    icon={<FaLink />}
                />

                <div className="grid grid-cols-2 gap-4">
                    {/* Duration in Seconds */}
                    <InputField 
                        label="Duration (Seconds)" 
                        name="durationSec" 
                        type="number" 
                        value={lecture.durationSec} 
                        handleChange={handleChange} 
                        required={true}
                        min="0"
                        icon={<FaClock />}
                    />

                    {/* Order Index */}
                    <InputField 
                        label="Order Index (e.g., 1, 2, 3)" 
                        name="orderIndex" 
                        type="number" 
                        value={lecture.orderIndex} 
                        handleChange={handleChange} 
                        required={true}
                        min="1"
                        icon={<FaListOl />}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || courses.length === 0 || !lecture.courseId}
                    // 🎨 FIX 6: Indigo button styling
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-xl hover:bg-indigo-700 transition disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
                >
                    <FaVideo /> {loading ? "Loading..." : "Add Lecture"}
                </button>

            </form>
        </div>
      </div>
    </div>
  );
};

/* ------------------- Reusable Components (Updated for Dark Theme) ------------------- */

const InputField = ({ label, name, value, handleChange, type = "text", required, min, icon }) => (
  <div>
    {/* 🎨 Light label color */}
    <label className="font-semibold text-lg flex items-center gap-2 mb-1 text-gray-300">
        {icon && <span className="text-gray-400">{icon}</span>}
        {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      required={required}
      min={min}
      // 🎨 Dark input styling
      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

const TextAreaField = ({ label, name, value, handleChange, required }) => (
  <div>
    {/* 🎨 Light label color */}
    <label className="font-semibold text-lg flex items-center gap-2 mb-1 text-gray-300">{label}</label>
    <textarea
      name={name}
      value={value}
      rows="3"
      onChange={handleChange}
      required={required}
      // 🎨 Dark textarea styling
      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
    ></textarea>
  </div>
);

export default AdminAddLectures;