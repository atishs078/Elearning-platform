import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import Data from "../store/Data";
import AdminSideMenu from "../components/AdminSideMenu";
import { FaVideo, FaBook, FaListOl, FaClock, FaEdit, FaTrash, FaTimes, FaSave, FaChevronDown } from "react-icons/fa";

const AdminUpdateDeleteLecture = () => {
    const { host } = Data();
    const token = localStorage.getItem("adminToken");
    
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [courseLectures, setCourseLectures] = useState([]);
    
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingLectures, setLoadingLectures] = useState(false);
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [currentLecture, setCurrentLecture] = useState(null);

    // Form State (for modal)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        videoUrl: "",
        durationSec: 0,
        orderIndex: 1,
    });

    // --- Fetch Courses ---
    const fetchCourses = async () => {
        try {
            const res = await fetch(`${host}/courses`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch courses");
            const json = await res.json();
            setCourses(json);
            if (json.length > 0) setSelectedCourseId(json[0].id);
        } catch (err) {
            Swal.fire("Error", "Could not load courses.", "error");
        } finally {
            setLoadingCourses(false);
        }
    };

    // --- Fetch Lectures for Selected Course ---
    const fetchLectures = useCallback(async (courseId) => {
        if (!courseId) return;
        setLoadingLectures(true);
        setCourseLectures([]);
        try {
            const res = await fetch(`${host}/courses/${courseId}/lectures`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch lectures");
            const json = await res.json();
            setCourseLectures(json);
        } catch (err) {
            Swal.fire("Error", "Could not load lectures.", "error");
        } finally {
            setLoadingLectures(false);
        }
    }, [host, token]);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            fetchLectures(selectedCourseId);
        }
    }, [selectedCourseId, fetchLectures]);

    // --- Modal Handlers ---
    const openEditModal = (lecture) => {
        setCurrentLecture(lecture);
        setFormData({
            title: lecture.title,
            description: lecture.description,
            videoUrl: lecture.videoUrl,
            durationSec: lecture.durationSec,
            orderIndex: lecture.orderIndex,
        });
        setShowModal(true);
    };

    const handleFormChange = (e) => {
        const value = e.target.name === 'durationSec' || e.target.name === 'orderIndex' 
                      ? parseInt(e.target.value) : e.target.value;
        setFormData(prev => ({ ...prev, [e.target.name]: value }));
    };

    // --- API Call: Update Lecture ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!currentLecture) return;

        try {
            const payload = {
                ...formData,
                courseId: currentLecture.courseId, // Keep original course ID
            };

            const res = await fetch(`${host}/admin/lectures/${currentLecture.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Update failed.");

            Swal.fire("Success!", "Lecture updated successfully.", "success");
            setShowModal(false);
            fetchLectures(selectedCourseId); // Refresh list

        } catch (err) {
            Swal.fire("Error", err.message || "Failed to update lecture.", "error");
        }
    };

    // --- API Call: Delete Lecture ---
    const handleDelete = async (lectureId, title) => {
        Swal.fire({
            title: "Confirm Deletion?",
            text: `Are you sure you want to delete lecture: ${title}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#4f46e5",
            confirmButtonText: "Yes, Delete It!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${host}/admin/lectures/${lectureId}`, {
                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${token}` },
                    });

                    if (!res.ok) throw new Error("Deletion failed.");

                    Swal.fire("Deleted!", `${title} has been removed.`, "success");
                    setShowModal(false);
                    fetchLectures(selectedCourseId); // Refresh list
                    
                } catch (err) {
                    Swal.fire("Error", err.message || "Failed to delete lecture.", "error");
                }
            }
        });
    };

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

                <h1 className="text-3xl font-bold text-indigo-400 mb-6 flex items-center gap-2 ml-4">
                    <FaEdit className="text-indigo-400" /> Manage Lectures
                </h1>

                {/* --- Course Selection Block --- */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 max-w-4xl mx-auto mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200 flex items-center gap-2">
                        <FaBook /> Select Course
                    </h2>

                    {loadingCourses ? (
                        <div className="p-3 text-gray-400 bg-gray-700 rounded-lg">Loading courses...</div>
                    ) : courses.length === 0 ? (
                        <div className="p-3 text-red-400 bg-red-900/20 rounded-lg">No courses available.</div>
                    ) : (
                        <div className="relative">
                            <select
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                className="w-full p-3 border border-gray-600 rounded-lg appearance-none bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    )}
                </div>

                {/* --- Lecture List --- */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 max-w-4xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200 flex items-center gap-2">
                        <FaListOl /> Lectures for Course ({courseLectures.length})
                    </h2>
                    
                    {loadingLectures ? (
                        <p className="text-gray-400">Fetching lectures...</p>
                    ) : courseLectures.length === 0 ? (
                        <p className="text-gray-400">No lectures found for this course.</p>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                            {courseLectures.map((lecture, index) => (
                                <div 
                                    key={lecture.id}
                                    className="flex justify-between items-center bg-gray-700 p-3 rounded-lg border border-gray-600 hover:bg-gray-700/80 transition"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white truncate">{index + 1}. {lecture.title}</p>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <FaClock size={10} /> {lecture.durationSec}s
                                        </p>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => openEditModal(lecture)}
                                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm flex items-center gap-1"
                                        >
                                            <FaEdit size={12} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(lecture.id, lecture.title)}
                                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm flex items-center gap-1"
                                        >
                                            <FaTrash size={12} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ================== UPDATE/DELETE MODAL ================== */}
            {showModal && currentLecture && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50 overflow-y-auto">
                    
                    <div className="bg-gray-800 w-full max-w-3xl p-8 rounded-2xl shadow-2xl relative border border-gray-700 my-8">

                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-red-500 transition"
                        >
                            <FaTimes size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-indigo-400">
                            Edit Lecture: {currentLecture.title}
                        </h2>

                        <form onSubmit={handleUpdate} className="space-y-5">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ModalInputField label="Title" name="title" value={formData.title} handleChange={handleFormChange} type="text" />
                                <ModalInputField label="Video URL" name="videoUrl" value={formData.videoUrl} handleChange={handleFormChange} type="text" />
                            </div>
                            
                            <ModalTextAreaField label="Description" name="description" value={formData.description} handleChange={handleFormChange} rows={3}/>

                            <div className="grid grid-cols-2 gap-4">
                                <ModalInputField label="Duration (s)" name="durationSec" value={formData.durationSec} handleChange={handleFormChange} type="number" min="0" />
                                <ModalInputField label="Order Index" name="orderIndex" value={formData.orderIndex} handleChange={handleFormChange} type="number" min="1" />
                            </div>
                            
                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold text-xl hover:bg-indigo-700 shadow-md transition flex items-center justify-center gap-2"
                                >
                                    <FaSave /> Save Updates
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(currentLecture.id, currentLecture.title)}
                                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-md transition flex items-center gap-2"
                                >
                                    <FaTrash /> Delete Lecture
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUpdateDeleteLecture;

/* ===================== Modal Reusable Components ===================== */

const ModalInputField = ({ label, name, value, handleChange, type = "text", min }) => (
  <div>
    <label className="font-semibold text-lg text-gray-300">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      required
      min={min}
      className="w-full mt-1 p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
    />
  </div>
);

const ModalTextAreaField = ({ label, name, value, handleChange, rows = 3 }) => (
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