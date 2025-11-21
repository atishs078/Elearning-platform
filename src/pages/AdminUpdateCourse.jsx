import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Data from "../store/Data";
import AdminSideMenu from "../components/AdminSideMenu";
import { FaEdit, FaTimes, FaSearch, FaTrash, FaPlus, FaSave } from "react-icons/fa";

const AdminUpdateCourse = () => {
  const { host } = Data();

  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [course, setCourse] = useState({
    title: "",
    shortDescription: "",
    description: "",
    category: "",
    price: "",
    thumbnailUrl: "",
  });

  const [lectures, setLectures] = useState([]);

  const fetchCourses = async () => {
    // ... (fetchCourses logic remains the same)
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
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const loadCourse = async (id) => {
    // ... (loadCourse logic remains the same)
    try {
      const res = await fetch(`${host}/courses/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load course");
      const json = await res.json();
      setSelectedCourseId(id);
      setCourse({
        title: json.title,
        shortDescription: json.shortDescription,
        description: json.description,
        category: json.category,
        price: json.price,
        thumbnailUrl: json.thumbnailUrl,
      });

      setLectures(json.lectures || []);
      setShowModal(true);

    } catch (err) {
      console.log("Load error:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const cleanLectures = lectures.filter(lec => lec && lec.trim() !== "");

    const payload = {
      ...course,
      price: parseFloat(course.price),
      lectures: cleanLectures,
    };

    try {
      const res = await fetch(`${host}/admin/courses/${selectedCourseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
         const errorData = await res.json().catch(() => ({ message: "Update failed" }));
         throw new Error(errorData.message || "Update failed");
      }

      const json = await res.json();

      Swal.fire({
        icon: "success",
        title: "Updated Successfully!",
        text: json.title,
        timer: 1500,
        showConfirmButton: false,
      });

      setShowModal(false);
      fetchCourses();

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.message,
      });
    }
  };

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const addLecture = () => setLectures([...lectures, ""]);
  const handleLectureChange = (value, index) => {
    const updated = [...lectures];
    updated[index] = value;
    setLectures(updated);
  };
  const removeLecture = (index) =>
    setLectures(lectures.filter((_, i) => i !== index));

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  
  const sidebarWidthClass = sidebarOpen ? "w-64" : "w-20";
  const marginClass = sidebarOpen ? "ml-64" : "ml-20";


  return (
    <div className="flex bg-gray-900 min-h-screen">

      {/* Sidebar */}
      <div className={`h-full fixed left-0 top-0 ${sidebarWidthClass} z-50`}>
        <AdminSideMenu open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${marginClass} p-6 font-sans overflow-y-auto transition-all duration-300`}>

        <h1 className="text-3xl font-bold text-indigo-400 mb-6 flex items-center gap-2 ml-2">
            <FaEdit className="text-indigo-400" /> Update Course
        </h1>

        {/* Search Block */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 max-w-4xl mx-auto mb-8">

          <h2 className="text-xl font-semibold mb-4 text-gray-200 flex items-center gap-2">
            <FaSearch /> Search Courses
          </h2>

          <input
            type="text"
            placeholder="Search course by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded-lg mb-6 focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
          />

          <div className="max-h-96 overflow-y-auto border border-gray-600 rounded-lg">
            {filteredCourses.map((c) => (
              <div
                key={c.id}
                className="p-3 border-b border-gray-700 last:border-b-0 flex justify-between items-center hover:bg-gray-700 transition"
              >
                <div>
                  <p className="font-semibold text-white">{c.title}</p>
                  <p className="text-sm text-gray-400">{c.category}</p>
                </div>

                <button
                  onClick={() => loadCourse(c.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md text-sm"
                >
                  <FaEdit size={14} /> Edit
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* ================== UPDATE MODAL ================== */}
        {showModal && (
          // 🛠️ FIX 1: Add overflow-y-auto to the fixed backdrop to enable scrolling of the whole modal area
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50 overflow-y-auto">
            
            {/* 🛠️ FIX 2: Ensure content container has a maximum height to enable its internal scrolling
                 We use 'h-fit' or simply rely on 'max-h-full' for the modal content itself, 
                 but ensuring the inner form scrolls is key. 
            */}
            <div className="bg-gray-800 w-full max-w-3xl p-8 rounded-2xl shadow-2xl relative border border-gray-700 my-8 mt-72">

              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-red-500 transition"
              >
                <FaTimes size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-indigo-400 ">
                Update Course: {course.title}
              </h2>

              <form onSubmit={handleUpdate} className="space-y-5 "> 

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Title" name="title" value={course.title} handleChange={handleChange} type="text" />
                    <InputField label="Short Description" name="shortDescription" value={course.shortDescription} handleChange={handleChange} type="text" />
                </div>
                
                <TextAreaField label="Description" name="description" value={course.description} handleChange={handleChange} rows={4}/>

                <div className="grid grid-cols-3 gap-4">
                    <InputField label="Category" name="category" value={course.category} handleChange={handleChange} type="text" />
                    <InputField label="Price (₹)" name="price" type="number" value={course.price} handleChange={handleChange}  />
                    <InputField label="Thumbnail URL" name="thumbnailUrl" value={course.thumbnailUrl} handleChange={handleChange} type="text" />
                </div>

                {/* LECTURES */}
                <div>
                  <label className="font-semibold text-lg text-gray-300">Lecture Titles/URLs</label>

                  {lectures.map((lec, index) => (
                    <div key={index} className="flex gap-3 mt-2 items-center">

                      <input
                        type="text"
                        value={lec}
                        onChange={(e) => handleLectureChange(e.target.value, index)}
                        className="flex-1 p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
                        placeholder={`Lecture ${index + 1}`}
                      />

                      {lectures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLecture(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          <FaTrash size={12} />
                        </button>
                      )}

                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addLecture}
                    className="mt-3 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1 text-sm"
                  >
                    <FaPlus size={12} /> Add Lecture
                  </button>
                </div>

                {/* Update Button */}
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-xl hover:bg-indigo-700 shadow-md transition flex items-center justify-center gap-2"
                >
                  <FaSave /> Save Updates
                </button>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

/* ===================== Reusable Components ===================== */

const InputField = ({ label, name, value, handleChange, type = "text" }) => (
  <div>
    <label className="font-semibold text-lg text-gray-300">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      required
      className="w-full mt-1 p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
    />
  </div>
);

const TextAreaField = ({ label, name, value, handleChange, rows = 5 }) => (
  <div>
    <label className="font-semibold text-lg text-gray-300">{label}</label>
    <textarea
      name={name}
      value={value}
      rows={rows}
      onChange={handleChange}
      required
      className="w-full mt-1 p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
    ></textarea>
  </div>
);

export default AdminUpdateCourse;