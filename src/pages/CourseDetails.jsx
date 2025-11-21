import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Data from '../store/Data';
import { FaBook, FaCheckCircle, FaClock, FaListOl, FaDollarSign, FaPlayCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const CourseDetails = () => {
  const { host } = Data();
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem("authtoken"); 

  const formatDuration = (totalSeconds) => {
    if (typeof totalSeconds !== 'number' || isNaN(totalSeconds)) return 'N/A';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  // --- Check Enrollment Status (Memoized) ---
  const checkEnrollmentStatus = useCallback(async () => {
    if (!token) {
        setIsEnrolled(false);
        return false;
    }

    try {
      const res = await fetch(`${host}/users/me/enrolled`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
      });

      if (!res.ok) throw new Error("Failed to check enrollment status.");
      
      const enrolledIds = await res.json();
      const enrolled = enrolledIds.includes(id);
      setIsEnrolled(enrolled);
      return enrolled;

    } catch (err) {
      console.error("Enrollment check error:", err);
      setIsEnrolled(false);
      return false;
    }
  }, [host, id, token]);


  // --- Fetch Course Data (Memoized) ---
  const fetchCourseData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLectures([]);

    try {
      // 1. Fetch Course Details (ALWAYS Public)
      const courseRes = await fetch(`${host}/courses/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!courseRes.ok) throw new Error("Failed to fetch course details.");
      const courseData = await courseRes.json();
      setCourse(courseData);

      // 2. Check Enrollment Status
      const isUserEnrolled = await checkEnrollmentStatus();

      // 3. Conditionally Fetch Lectures (ONLY if enrolled)
      if (isUserEnrolled) {
        // Must include Authorization header when fetching private resources
        const lectureRes = await fetch(`${host}/courses/${id}/lectures`, {
          method: "GET",
          headers: { 
             "Content-Type": "application/json",
             "Authorization": `Bearer ${token}` 
          },
        });
        if (!lectureRes.ok) throw new Error("Failed to fetch lectures.");
        const lectureData = await lectureRes.json();
        setLectures(lectureData);
      } 

    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Could not load course. Please try again later.");
      Swal.fire("Error", "Course not found or network error.", "error");
    } finally {
      setLoading(false);
    }
  }, [host, id, token, checkEnrollmentStatus]); // Added token dependency for lecture fetch


  
  useEffect(() => {
    if (id) {
      fetchCourseData();
    } else {
      setLoading(false);
      setError("No Course ID provided.");
    }
  }, [id, fetchCourseData]);


  // --- Handle Enrollment (No change in logic) ---
  const handleEnroll = async () => {
    if (!token) {
        Swal.fire("Login Required", "Please log in to enroll in the course.", "info");
        return;
    }
    
    try {
      const res = await fetch(`${host}/courses/${id}/enroll`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
      });

      if (!res.ok) throw new Error("Enrollment failed.");

      Swal.fire("Success!", "You have successfully enrolled in the course.", "success");
      setIsEnrolled(true); 
      fetchCourseData(); 

    } catch (err) {
      console.error("Enrollment error:", err);
      Swal.fire("Error", "Enrollment failed. Please try again.", "error");
    }
  };

  // --- Handle Continue Learning (No change in logic) ---
  const handleContinue = () => {
    if (lectures.length > 0) {
        navigate(`/lecture/${lectures[0].id}`); 
    } else {
        Swal.fire("Oops", "No lectures available to start. Reloading content...", "warning");
        fetchCourseData();
    }
  };


  if (loading) {
    // Dark theme loading screen
    return <div className="p-10 text-center text-xl bg-slate-900 text-gray-400 min-h-screen">Loading Course Details...</div>;
  }

  if (error || !course) {
    // Dark theme error screen
    return <div className="p-10 text-center text-xl bg-slate-900 text-red-400 min-h-screen">Error: {error || "Course data is missing."}</div>;
  }

  const totalDuration = lectures.reduce((sum, lecture) => sum + (lecture.durationSec || 0), 0);


  return (
    // 1. Global Background Change
    <div className="min-h-screen bg-slate-900 font-sans">
      <div className="container mx-auto p-4 md:p-8">

        {/* --- Header Section (Thumbnail & Summary) --- */}
        {/* 2. Main Card Background & Shadow */}
        <div className="bg-slate-800 rounded-2xl shadow-xl shadow-slate-700/50 overflow-hidden md:flex">
          
          {/* Thumbnail */}
          {/* 3. Placeholder background adjusted */}
          <div className="md:w-1/3 bg-slate-700 flex-shrink-0">
            <img 
              src={course.thumbnailUrl || 'https://via.placeholder.com/600x400?text=Course+Thumbnail'}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Course Summary */}
          <div className="md:w-2/3 p-6 md:p-10">
            {/* 4. Category text adjusted for dark background */}
            <span className="text-sm font-semibold text-purple-400 bg-purple-900/50 px-3 py-1 rounded-full">{course.category}</span>
            
            {/* 5. Title color changed to white */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-3 mb-4">{course.title}</h1>
            
            {/* 6. Description color changed to light gray */}
            <p className="text-gray-300 text-lg mb-6">{course.shortDescription}</p>

            {/* 7. Details text color changed to light gray */}
            <div className="flex flex-wrap gap-6 mb-8 text-gray-400">
                <div className="flex items-center gap-2">
                    <FaListOl className="text-blue-400" />
                    <span>{isEnrolled ? lectures.length : '—'} Lessons</span> 
                </div>
                <div className="flex items-center gap-2">
                    <FaClock className="text-blue-400" />
                    <span>Total Duration: {formatDuration(totalDuration)}</span>
                </div>
                {/* 8. Price color adjusted */}
                <div className="flex items-center gap-2 font-bold text-teal-400">
                    <FaDollarSign />
                    <span>Price: ₹{course.price}</span>
                </div>
            </div>

            {/* Action Button: Conditional Rendering (Colors remain strong) */}
            <button 
              onClick={isEnrolled ? handleContinue : handleEnroll}
              className={`px-8 py-3 font-bold text-lg rounded-xl shadow-lg transition duration-300 flex items-center gap-2 
                         ${isEnrolled ? 'bg-green-600 hover:bg-green-500' : 'bg-indigo-600 hover:bg-indigo-500'} text-white`}
            >
              {isEnrolled ? (
                <>
                  <FaPlayCircle /> Continue Learning
                </>
              ) : (
                <>
                  <FaCheckCircle /> Enroll Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* --- Details and Lectures Section --- */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Full Description (Col 1/2) */}
          <div className="lg:col-span-2">
            {/* 9. Heading and border adjusted */}
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Course Overview</h2>
            
            {/* 10. Description text adjusted */}
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{course.description}</p>
          </div>

          {/* Lecture List (Col 3) */}
          <div className="lg:col-span-1">
            {/* 11. Heading and border adjusted */}
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-2 flex items-center">
                <FaBook className='mr-2' /> Course Content
            </h2>

            {/* 12. Lecture List Container adjusted */}
            <div className="bg-slate-800 p-4 rounded-xl shadow-md space-y-3 border border-slate-700">
              {isEnrolled ? (
                lectures.length === 0 ? (
                  // 13. Empty state text adjusted
                  <p className="text-gray-500">No lectures have been added yet.</p>
                ) : (
                  lectures.map((lecture, index) => (
                    // 14. Lecture item border adjusted
                    <div key={lecture.id} className="border-b border-slate-700 last:border-b-0 py-2">
                      <div className="flex justify-between items-center">
                        {/* 15. Lecture Title adjusted */}
                        <span className="font-semibold text-white">
                          {index + 1}. {lecture.title}
                        </span>
                        {/* 16. Duration text adjusted */}
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <FaClock /> {formatDuration(lecture.durationSec)}
                        </span>
                      </div>
                      {/* 17. Link color adjusted */}
                      <Link to={`/lecture/${lecture.id}`} className="text-indigo-400 text-sm hover:underline">
                          Start/Continue Lesson
                      </Link>
                    </div>
                  ))
                )
              ) : (
                // 18. Enroll prompt box adjusted
                <p className="text-gray-400 p-4 bg-slate-700 rounded-lg">
                    Enroll to view the full list of lessons and start learning!
                </p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CourseDetails;