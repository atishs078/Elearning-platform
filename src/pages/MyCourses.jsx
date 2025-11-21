import React, { useEffect, useState, useCallback } from 'react';
import Data from '../store/Data';
import CourseCard from '../components/CourseCard';
import SideMenu from '../components/SideMenu'; // Assuming SideMenu exists
import { FaBookReader } from 'react-icons/fa';

const MyCourses = () => {
  const { host } = Data();
  const token = localStorage.getItem("authtoken"); 
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching Functions ---

  const fetchEnrolledIds = useCallback(async () => {
    if (!token) return [];

    try {
      const res = await fetch(`${host}/users/me/enrolled`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
      });
      if (!res.ok) throw new Error("Failed to fetch enrollment status.");
      
      const enrolledIds = await res.json();
      return enrolledIds;

    } catch (err) {
      console.error("Enrollment check error:", err);
      setError("Failed to load your enrollment list.");
      return [];
    }
  }, [host, token]);

  const fetchAllAndFilterCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // 1. Fetch enrolled IDs immediately
    const enrolledIds = await fetchEnrolledIds(); 
    
    if (enrolledIds.length === 0) {
        setEnrolledCourses([]);
        setLoading(false);
        return;
    }

    try {
      // 2. Fetch all courses
      const res = await fetch(`${host}/courses`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to fetch all courses");

      const courses = await res.json();
      
      // 3. Filter courses using the immediately available enrolledIds
      const currentEnrolledCourses = courses.filter(course => 
        enrolledIds.includes(course.id)
      );

      setEnrolledCourses(currentEnrolledCourses);
      
    } catch (err) {
      console.error("Course fetch error:", err);
      setError("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  }, [host, fetchEnrolledIds]);

  useEffect(() => {
    if (token) {
        fetchAllAndFilterCourses();
    } else {
        setError("You must be logged in to view your courses.");
        setLoading(false);
    }
  }, [fetchAllAndFilterCourses, token]);


  // --- Render Helpers ---

  const renderContent = () => {
    if (loading) {
        return <p className="text-gray-400 text-lg">Loading your enrolled courses...</p>;
    }
    
    if (error) {
        return <p className="text-red-400 text-lg">Error: {error}</p>;
    }

    if (enrolledCourses.length === 0) {
        return (
            <div className="p-8 bg-slate-800 rounded-xl shadow-lg border border-slate-700 text-center">
                <FaBookReader className="text-indigo-400 text-5xl mx-auto mb-4" />
                <p className="text-white text-xl font-semibold">No Courses Enrolled</p>
                <p className="text-gray-400 mt-2">Looks like you haven't started any courses yet. Check the dashboard for recommendations!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enrolledCourses.map((course) => (
                <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.shortDescription || `Start learning ${course.title}.`}
                    thumbnailUrl={course.thumbnailUrl} 
                    // NOTE: Progress fetching is skipped here for simplicity but should ideally be integrated 
                    // from a separate progress map fetch if required.
                    isDarkTheme={true} 
                />
            ))}
        </div>
    );
  };


  return (
   // --- Dark Theme Layout ---
   <div className="flex bg-slate-900 min-h-screen overflow-hidden">
      <div className="w-64 flex-shrink-0">
        <SideMenu isDarkTheme={true} />
      </div>
      
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-4"> 
            
            <h1 className="text-4xl font-extrabold text-white mb-8 border-b border-slate-700 pb-3 flex items-center gap-3">
                <FaBookReader className="text-indigo-400" /> My Enrolled Courses
            </h1>
            
            {renderContent()}

        </div>
      </div>
    </div>
  );
};

export default MyCourses;