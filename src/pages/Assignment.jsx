import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Data from '../store/Data';
import { FaClipboardList, FaHourglassHalf, FaGraduationCap, FaCheckCircle, FaBook, FaTimesCircle, FaLink, FaChevronRight } from 'react-icons/fa';
import Swal from 'sweetalert2';
import SideMenu from '../components/SideMenu'; 

const MyAssignmentsList = () => {
    const { host } = Data();
    const navigate = useNavigate();
    const token = localStorage.getItem("authtoken"); 
    const [assignmentsData, setAssignmentsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchAllAssignments = useCallback(async () => {
        if (!token) {
            setError('Authentication required. Please log in.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
       
            const enrolledRes = await fetch(`${host}/users/me/enrolled`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!enrolledRes.ok) throw new Error('Failed to fetch enrollment status.');
            const enrolledCourseIds = await enrolledRes.json();
            
            if (enrolledCourseIds.length === 0) {
                setAssignmentsData([]);
                setLoading(false);
                return;
            }

       
            const submissionsRes = await fetch(`${host}/users/me/submissions`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!submissionsRes.ok) throw new Error('Failed to fetch user submissions.');
            const userSubmissions = await submissionsRes.json();
            const submissionMap = userSubmissions.reduce((map, sub) => {
                map[sub.assignmentId] = sub;
                return map;
            }, {});

            const assignmentPromises = enrolledCourseIds.map(courseId => 
                fetch(`${host}/courses/${courseId}/assignments`, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => res.json())
                .then(assignments => ({ courseId, assignments }))
                .catch(err => {
                    console.error(`Error fetching assignments for course ${courseId}:`, err);
                    return { courseId, assignments: [] };
                })
            );
            
            const results = await Promise.all(assignmentPromises);

            let finalData = [];
            
            for (const courseResult of results) {
      
                const courseTitleRes = await fetch(`${host}/courses/${courseResult.courseId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
          
                const courseTitleData = await courseTitleRes.json();
                const courseTitle = courseTitleData?.title || `Course ID: ${courseResult.courseId}`;

                courseResult.assignments.forEach(assignment => {
                    const submission = submissionMap[assignment.id];
                    
                    finalData.push({
                        ...assignment,
                        courseTitle,
                        courseId: courseResult.courseId, 
                        submission: submission || null,
                        status: submission 
                            ? (submission.status === 'GRADED' ? 'GRADED' : 'SUBMITTED') 
                            : 'PENDING',
                    });
                });
            }

            setAssignmentsData(finalData);

        } catch (err) {
            console.error("Master Fetch Error:", err);
            setError(err.message || 'Failed to load assignments list.');
        } finally {
            setLoading(false);
        }
    }, [host, token]);

    useEffect(() => {
        fetchAllAssignments();
    }, [fetchAllAssignments]);
    
    // --- Navigation Handler ---
    const handleNavigateToSubmission = (assignmentId) => {
        navigate(`/assignments/${assignmentId}/submit`);
    };


    if (loading) {
        return <div className="p-10 text-center text-xl text-gray-400 bg-gray-900 min-h-screen">Loading all assignments...</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-xl text-red-400 bg-gray-900 min-h-screen">Error: {error}</div>;
    }
    
    // Group assignments by status for better visualization
    const groupedAssignments = assignmentsData.reduce((acc, assignment) => {
        acc[assignment.status] = acc[assignment.status] || [];
        acc[assignment.status].push(assignment);
        return acc;
    }, {});


    return (
      
        <div className="flex bg-gray-900 min-h-screen font-sans">
            <div className="w-64 flex-shrink-0">
                <SideMenu />
            </div>
            <div className="flex-1 p-4 md:p-8">
              
                <h1 className="text-3xl font-bold text-indigo-400 mb-8 flex items-center">
                    <FaClipboardList className="mr-3" /> My Assignments Overview
                </h1>

                {assignmentsData.length === 0 && (
                     <div className="p-10 bg-gray-800 rounded-xl shadow-md text-center text-gray-400 border border-gray-700">
                        You have no pending or active assignments in your enrolled courses.
                     </div>
                )}

                {/* Display Sections */}
                {['PENDING', 'SUBMITTED', 'GRADED'].map(statusKey => {
                    const assignments = groupedAssignments[statusKey] || [];
                    if (assignments.length === 0) return null;

                    const statusInfo = {
                        'PENDING': { title: 'To Do (Pending Submission)', icon: <FaHourglassHalf />, color: 'text-red-400', bg: 'bg-red-900/20', buttonColor: 'bg-red-600' },
                        'SUBMITTED': { title: 'Submitted (Awaiting Review)', icon: <FaCheckCircle />, color: 'text-orange-400', bg: 'bg-orange-900/20', buttonColor: 'bg-orange-600' },
                        'GRADED': { title: 'Graded', icon: <FaGraduationCap />, color: 'text-green-400', bg: 'bg-green-900/20', buttonColor: 'bg-green-600' },
                    };
                    const info = statusInfo[statusKey];

                    return (
                        <div key={statusKey} className="mb-8">
                            {/* 🎨 FIX 3: Light section header */}
                            <h2 className={`text-2xl font-bold mb-4 ${info.color} flex items-center gap-2`}>
                                {info.icon} {info.title} ({assignments.length})
                            </h2>
                            <div className="space-y-4">
                                {assignments.map(assignment => (
                                    // 🎨 FIX 4: Dark content container
                                    <div key={assignment.id} className={`p-5 rounded-xl shadow-lg border border-gray-700 ${info.bg}`}>
                                        
                                        <div className="flex justify-between items-start">
                                            <div>
                                                {/* 🎨 FIX 5: Light text color */}
                                                <h3 className="text-xl font-bold text-gray-200">{assignment.title}</h3>
                                                <p className="text-sm font-semibold text-indigo-400 flex items-center gap-1 mt-1">
                                                    <FaBook /> {assignment.courseTitle}
                                                </p>
                                            </div>
                                            
                                            <div className="text-right">
                                                <span className={`text-sm font-bold px-3 py-1 rounded-full ${info.color}`}>{statusKey}</span>
                                                <p className="text-xs text-gray-400 mt-1">Due: {assignment.dueDate || 'N/A'}</p>
                                            </div>
                                        </div>

                                        {assignment.status === 'GRADED' && assignment.submission && (
                                            // 🎨 FIX 6: Dark graded feedback styling
                                            <div className="mt-3 p-3 bg-gray-700 rounded-lg border border-green-600/30">
                                                <p className="font-bold text-green-400">Grade: {assignment.submission.grade} / {assignment.maxMarks}</p>
                                                <p className="text-sm text-gray-300">Feedback: {assignment.submission.feedback || 'None.'}</p>
                                            </div>
                                        )}
                                        
                                        <div className="mt-4 flex gap-3">
                                            
                                            <button 
                                                onClick={() => handleNavigateToSubmission(assignment.id)}
                                                // 🎨 FIX 7: Use Indigo/Primary color for action button
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition shadow-md"
                                            >
                                                {assignment.status === 'PENDING' ? 'Submit Assignment' : 'View Details'}
                                            </button>
                                            
                                            {assignment.submission?.submissionUrl && (
                                                <a 
                                                    href={assignment.submission.submissionUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    // 🎨 FIX 8: Dark theme button styling
                                                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 flex items-center gap-1"
                                                >
                                                    <FaLink /> View Work
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
};

export default MyAssignmentsList;