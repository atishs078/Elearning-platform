import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Data from '../store/Data';
import { FaVideo, FaBookOpen, FaClock, FaListOl, FaChevronRight, FaPlayCircle, FaCheck } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Lectures = () => {
    const { host } = Data();
    const { id } = useParams(); // Current lecture ID
    // Renamed authToken to token for consistency with other components
    const token = localStorage.getItem("authtoken"); 

    const [lecture, setLecture] = useState(null);
    const [courseLectures, setCourseLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progressMap, setProgressMap] = useState({});
    const [isCompleted, setIsCompleted] = useState(false); 

    const formatDuration = (totalSeconds) => {
        if (typeof totalSeconds !== 'number' || isNaN(totalSeconds)) return 'N/A';
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}m ${seconds}s`;
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.get('v')) {
                return `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}`;
            }
            if (urlObj.hostname.includes('youtu.be')) {
                return `https://www.youtube.com/embed/${urlObj.pathname.substring(1)}`;
            }
        } catch (e) {
            if (url.length === 11 && !url.includes(' ')) {
                return `https://www.youtube.com/embed/${url}`;
            }
        }
        return null; 
    };

    // --- PROGRESS UPDATE LOGIC (No changes needed) ---
    const updateProgress = useCallback(async (courseId, completedLectureId) => {
        if (!token || !courseId || courseLectures.length === 0) return;

        const totalLectures = courseLectures.length;
        const completedIndex = courseLectures.findIndex(l => l.id === completedLectureId);
        
        if (completedIndex === -1) return;

        const newCompletedCount = completedIndex + 1;
        const newProgressPercent = (newCompletedCount / totalLectures) * 100;
        
        const payload = { percent: newProgressPercent };

        try {
            const res = await fetch(`${host}/users/me/courses/${courseId}/progress`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to update progress.");
            
            console.log(`Progress updated to: ${newProgressPercent.toFixed(2)}%`);
            setProgressMap(prev => ({...prev, [courseId]: newProgressPercent}));

        } catch (err) {
            console.error("Progress update error:", err);
        }
    }, [host, courseLectures, token]);
    
    // --- Fetch Progress Map (No changes needed) ---
    const fetchProgressMap = useCallback(async () => {
        if (!token) return {};
        try {
            const res = await fetch(`${host}/users/me/progress`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
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

    // --- Fetch All Data inside useEffect (No changes needed) ---
    useEffect(() => {
        if (!id) {
            setLoading(false);
            setError("No Lecture ID provided.");
            return;
        }

        const fetchLectureData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const map = await fetchProgressMap();

                // 1. Fetch CURRENT Lecture Details
                const res = await fetch(`${host}/lectures/${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!res.ok) throw new Error("Failed to fetch current lecture.");
                
                const currentLectureData = await res.json();
                setLecture(currentLectureData);
                
                const courseId = currentLectureData.courseId;
                
                // 2. Fetch ALL Lectures in the Course 
                let allLectures = [];
                if (courseId) {
                    // Must include Authorization header when fetching private resources
                    const lecturesRes = await fetch(`${host}/courses/${courseId}/lectures`, {
                        method: "GET",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}` // Added token here
                        },
                    });
                    if (!lecturesRes.ok) throw new Error("Failed to fetch course lectures.");
                    allLectures = await lecturesRes.json();
                    setCourseLectures(allLectures); 
                }
                
                // 3. Determine completion status
                const currentProgressPercent = map[courseId] || 0;
                
                if (allLectures.length > 0) {
                    const completedLectureIndex = allLectures.findIndex(l => l.id === id);
                    const completedLectureCount = completedLectureIndex + 1;
                    const requiredPercentForThisLecture = (completedLectureCount / allLectures.length) * 100;
                    
                    const completed = currentProgressPercent >= requiredPercentForThisLecture;
                    setIsCompleted(completed);
                } else {
                    setIsCompleted(false);
                }


            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Could not load lecture or course content.");
            } finally {
                setLoading(false);
            }
        };

        fetchLectureData();
        
    }, [host, id, token, fetchProgressMap]); // Added token dependency

    // --- Handler when video finishes (Simulated) ---
    const handleLectureFinish = () => {
        if (lecture && !isCompleted) {
            setIsCompleted(true);
            Swal.fire('Completed!', `You finished the lecture: ${lecture.title}`, 'success');
            
            updateProgress(lecture.courseId, lecture.id); 
            
            if (nextLecture) {
                // setTimeout(() => {
                //     window.location.href = `/lecture/${nextLecture.id}`; 
                // }, 1500);
            }
        }
    };


    if (loading) {
        // Dark theme loading screen
        return <div className="p-10 text-center text-xl bg-slate-900 text-gray-400 min-h-screen">Loading Lecture...</div>;
    }

    if (error || !lecture) {
        // Dark theme error screen
        return <div className="p-10 text-center text-xl bg-slate-900 text-red-400 min-h-screen">Error: {error || "Lecture data is missing."}</div>;
    }

    const embedUrl = getYouTubeEmbedUrl(lecture.videoUrl);
    const currentLectureIndex = courseLectures.findIndex(l => l.id === lecture.id);
    const nextLecture = currentLectureIndex !== -1 && currentLectureIndex < courseLectures.length - 1 ? courseLectures[currentLectureIndex + 1] : null;
    const prevLecture = currentLectureIndex > 0 ? courseLectures[currentLectureIndex - 1] : null;

    return (
        // 1. Global Background Change
        <div className="min-h-screen bg-slate-900 font-sans">
            <div className="flex">
                
                {/* --- Sidebar Lecture List --- */}
                {/* 2. Sidebar Background and Border */}
                <div className="w-80 flex-shrink-0 bg-slate-800 shadow-xl h-screen overflow-y-auto sticky top-0 border-r border-slate-700">
                    {/* 3. Sidebar Header */}
                    <h2 className="text-xl font-bold p-4 bg-indigo-700 text-white flex items-center">
                        <FaListOl className="mr-2" /> Course Content
                    </h2>
                    <div className="p-2 space-y-1">
                        {courseLectures.map((lec, index) => (
                            <Link 
                                key={lec.id} 
                                to={`/lecture/${lec.id}`} 
                                // 4. Sidebar Link Styles (Active/Hover)
                                className={`flex items-center p-3 rounded-lg transition text-white ${
                                    lec.id === id 
                                        ? 'bg-indigo-700 text-white font-bold' 
                                        : 'hover:bg-slate-700 text-gray-300'
                                }`}
                            >
                                <span className="mr-2 text-sm">{index + 1}.</span>
                                <span className="flex-1 text-sm truncate">{lec.title}</span>
                                {lec.id === id && <FaPlayCircle className="ml-2 text-indigo-300" />}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* --- Main Lecture View --- */}
                <div className="flex-1 p-4 md:p-8">
                    
                    {/* 5. Title color changed */}
                    <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-400 mb-2 flex items-center">
                        <FaVideo className="mr-3" /> {lecture.title}
                    </h1>
                    {/* 6. Details text color and border changed */}
                    <div className="flex flex-wrap gap-4 text-gray-400 mb-6 border-b border-slate-700 pb-4">
                        <span className="flex items-center gap-1"><FaClock /> Duration: {formatDuration(lecture.durationSec)}</span>
                        {isCompleted && <span className="flex items-center gap-1 text-teal-400 font-semibold"><FaCheck /> Completed!</span>}
                    </div>
                    
                    {/* Video Player */}
                    <div className="bg-black rounded-xl shadow-2xl overflow-hidden mb-8">
                        {embedUrl ? (
                            <>
                                <iframe
                                    title={lecture.title}
                                    width="100%"
                                    height="500"
                                    src={`${embedUrl}`} 
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="aspect-video"
                                ></iframe>
                                {/* 7. Video Footer/Mark Complete Button Area */}
                                <div className="p-4 bg-slate-800 text-white flex justify-end border-t border-slate-700">
                                    <button
                                        onClick={handleLectureFinish}
                                        disabled={isCompleted}
                                        className={`px-6 py-2 rounded-lg font-bold transition flex items-center gap-2 ${isCompleted 
                                            ? 'bg-teal-700 text-white cursor-not-allowed' 
                                            : 'bg-green-600 hover:bg-green-500'}`}
                                    >
                                        {isCompleted ? 'Finished' : 'Mark as Complete'} <FaCheck />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-96 text-gray-400 text-xl bg-slate-700">
                                <FaVideo className="mr-2" /> Video URL is missing or invalid.
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mb-8">
                        {/* 8. Previous Button (Disabled/Enabled) */}
                        <Link 
                            to={prevLecture ? `/lecture/${prevLecture.id}` : '#'}
                            onClick={(e) => !prevLecture && e.preventDefault()}
                            className={`px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 ${
                                prevLecture 
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <FaChevronRight className="rotate-180" /> Previous
                        </Link>

                        {/* 9. Next Button (Disabled/Enabled) */}
                        <Link 
                            to={nextLecture ? `/lecture/${nextLecture.id}` : '#'}
                            onClick={(e) => !nextLecture && e.preventDefault()}
                            className={`px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 ${
                                nextLecture 
                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Next <FaChevronRight />
                        </Link>
                    </div>

                    {/* Lecture Description */}
                    {/* 10. Description Card Background, Text, and Border */}
                    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Lecture Details</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{lecture.description}</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Lectures;