import React, { useEffect, useState, useCallback } from "react";
import SideMenu from "../components/SideMenu";
import SplitText from "../components/SplitText";
import CourseCard from "../components/CourseCard";
import Data from "../store/Data";

const StudentDashboard = () => {
  const { host } = Data();
  const token = localStorage.getItem("authtoken"); 

  // State to hold the filtered course lists and data (Adopted from previous fix)
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({}); 
  const [loading, setLoading] = useState(true);
  
  const name = localStorage.getItem("username"); 
  const recentSearches = Array.from({ length: 6 });

  // --- Data Fetching Functions (Unchanged for logic, keeping structure) ---

  const fetchProgressMap = useCallback(async () => {
    if (!token) return {};

    try {
      const res = await fetch(`${host}/users/me/progress`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user progress.");
      
      const map = await res.json();
      setProgressMap(map); 
      return map;
      
    } catch (err) {
      console.error("Progress fetch error:", err);
      return {}; 
    }
  }, [host, token]);

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
      return [];
    }
  }, [host, token]);

  const fetchAllAndFilterCourses = useCallback(async () => {
    setLoading(true);
    
    // Fetch auxiliary data and destructure the results immediately
    const [enrolledIds] = await Promise.all([
      fetchEnrolledIds(), 
      fetchProgressMap() 
    ]);

    try {
      const res = await fetch(`${host}/courses`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to fetch all courses");

      const courses = await res.json();
      setAllCourses(courses);

      // Filter courses using the *immediately available* enrolledIds
      const currentEnrolledCourses = courses.filter(course => 
        enrolledIds.includes(course.id)
      );
      
      const currentRecommendedCourses = courses.filter(course => 
        !enrolledIds.includes(course.id)
      );

      // Update the final course lists state
      setEnrolledCourses(currentEnrolledCourses);
      setRecommendedCourses(currentRecommendedCourses);
      
    } catch (err) {
      console.error("Course fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [host, fetchEnrolledIds, fetchProgressMap]);

  useEffect(() => {
    fetchAllAndFilterCourses();
  }, [fetchAllAndFilterCourses]);

  // --- Rendering Helpers ---
  const renderCourseContent = (courses, isEnrolledList = false) => {
    if (loading) {
        // Updated text color for dark theme
        return <p className="text-gray-400">Loading courses...</p>;
    }
    if (courses.length === 0) {
        // Updated text color for dark theme
        return <p className="text-gray-400">No courses found yet.</p>;
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
                // Assuming CourseCard handles its own dark mode styles (e.g., bg-gray-800)
                <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.shortDescription}
                    thumbnailUrl={course.thumbnailUrl}
                    progress={isEnrolledList ? progressMap[course.id] : undefined}
                    // Pass a dark prop if the CourseCard component supports it
                    isDarkTheme={true} 
                />
            ))}
        </div>
    );
  };


  return (
   // --- Global Background Change ---
   <div className="flex bg-slate-900 h-screen overflow-hidden">
      {/* Assuming SideMenu is also styled for dark mode */}
      <div className="w-64 flex-shrink-0">
        <SideMenu isDarkTheme={true} />
      </div>
      
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
        <SplitText
          text={`Welcome ${name}`}
          // --- Text color change (from default black to white) ---
          className="text-2xl md:text-3xl font-bold mt-4 font-sans text-white" 
          delay={100}
          duration={0.6}
        />
        
        {/* === Enrolled Courses === */}
        <div className="mt-6">
          <h2 className="text-xl md:text-2xl font-bold font-sans mb-4 text-teal-400">
            📚 My Enrolled Courses
          </h2>
          <div className="flex gap-5 overflow-x-auto pb-3 no-scrollbar">
            {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course) => (
                    <div key={course.id} className="min-w-[280px] flex-shrink-0">
                        <CourseCard
                            id={course.id}
                            title={course.title}
                            description={`Continue ${course.category}`}
                            thumbnailUrl={course.thumbnailUrl}
                            progress={progressMap[course.id]}
                            isDarkTheme={true}
                        />
                    </div>
                ))
            ) : loading ? (
                 // Updated text color
                 <p className="text-gray-400">Checking enrollments...</p>
            ) : (
                <p className="text-gray-400 p-4 bg-slate-800 rounded-lg shadow-xl">You are not enrolled in any courses yet. Check the recommendations below!</p>
            )}
          </div>
        </div>

        {/* === Recent Searches (Dummy Data) === */}
        <div className="mt-6">
          <p className="font-sans font-semibold text-indigo-400 mb-3 text-md">
            Recent Searches 
          </p>
          <div className="flex gap-5 overflow-x-auto pb-3 no-scrollbar">
            {recentSearches.map((_, index) => (
              <div key={index} className="min-w-[260px]">
                <CourseCard
                  title={`Recent ${index + 1}`}
                  description="Recently searched course."
                  isDarkTheme={true}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* === Recommended Courses === */}
        <div className="mt-10">
          <h2 className="text-xl md:text-2xl font-bold font-sans mb-4 text-white">
            🚀 Recommended Courses
          </h2>
          
          {/* Renders standard course cards */}
          {renderCourseContent(recommendedCourses, false)} 
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;