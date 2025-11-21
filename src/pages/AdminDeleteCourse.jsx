import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Data from "../store/Data";
import AdminSideMenu from "../components/AdminSideMenu";
import { FaTrashAlt, FaSearch } from "react-icons/fa";

const AdminDeleteCourse = () => {
  const { host } = Data();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

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

    } catch (err) {
      console.log("Fetch error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not fetch courses.",
      });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id, title) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the course: ${title}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#4f46e5", // Indigo color for cancel
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${host}/admin/courses/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
            },
          });

          if (!res.ok) throw new Error("Deletion failed");

          setCourses(courses.filter(c => c.id !== id));

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: `${title} has been deleted.`,
            timer: 1500,
            showConfirmButton: false,
          });

        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Deletion Failed",
            text: err.message,
          });
        }
      }
    });
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  
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

        {/* 🎨 FIX 2: Light title color, Red accent for deletion */}
        <h1 className="text-3xl font-bold text-red-400 mb-6 flex items-center gap-2 ml-3">
          <FaTrashAlt className="text-red-500" /> Delete Course
        </h1>

        {/* Search Block */}
        {/* 🎨 FIX 3: Dark container background */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 max-w-4xl mx-auto">

          {/* 🎨 FIX 4: Light header color */}
          <h2 className="text-xl font-semibold mb-4 text-gray-200 flex items-center gap-2">
            <FaSearch /> Search Courses to Delete
          </h2>

          <input
            type="text"
            placeholder="Search course by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            // 🎨 FIX 5: Dark input styling
            className="w-full p-3 border border-gray-600 rounded-lg mb-6 focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
          />

          <div className="max-h-96 overflow-y-auto border border-gray-600 rounded-lg">
            {filteredCourses.map((c) => (
              <div
                key={c.id}
                // 🎨 FIX 6: Dark list item styling
                className="p-3 border-b border-gray-700 last:border-b-0 flex justify-between items-center hover:bg-gray-700 transition"
              >
                <div>
                  <p className="font-semibold text-white">{c.title}</p>
                  <p className="text-sm text-gray-400">{c.category}</p>
                </div>

                <button
                  onClick={() => handleDelete(c.id, c.title)}
                  // 🎨 FIX 7: Red button for delete action
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md text-sm"
                >
                  <FaTrashAlt size={14} /> Delete
                </button>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDeleteCourse;