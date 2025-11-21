import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Data from "../store/Data";
import AdminSideMenu from "../components/AdminSideMenu";
import { FaGraduationCap, FaClipboardList, FaFileAlt, FaTimes, FaSave, FaBook, FaChevronDown } from "react-icons/fa";

const AdminCheckSubmission = () => {
  const { host } = Data();
  const adminToken = localStorage.getItem("adminToken");

  const [sidebarOpen, setSidebarOpen] = useState(true); // State for alignment
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Grading Modal State
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState({
    grade: 0,
    feedback: "",
    maxMarks: 100,
  });

  // --- Fetch Courses ---
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${host}/courses`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch courses");
      const json = await res.json();
      setCourses(json);
      setLoading(false);
    } catch (err) {
      console.error("Course fetch error:", err);
      Swal.fire("Error", "Could not load courses.", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [host]);

  // --- Fetch Assignments (when course changes) ---
  useEffect(() => {
    if (selectedCourseId) {
      const fetchAssignments = async () => {
        try {
          const res = await fetch(`${host}/courses/${selectedCourseId}/assignments`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${adminToken}` },
          });
          if (!res.ok) throw new Error("Failed to fetch assignments");
          const json = await res.json();
          setAssignments(json);
          // Auto-select the first assignment
          setSelectedAssignmentId(json.length > 0 ? json[0].id : "");
        } catch (err) {
          console.error("Assignment fetch error:", err);
          Swal.fire("Error", "Could not load assignments.", "error");
        }
      };
      fetchAssignments();
    } else {
        setAssignments([]);
        setSelectedAssignmentId("");
    }
  }, [host, selectedCourseId]);

  // --- Fetch Submissions (when assignment changes) ---
  useEffect(() => {
    if (selectedAssignmentId) {
      const fetchSubmissions = async () => {
        try {
          const res = await fetch(`${host}/admin/assignments/${selectedAssignmentId}/submission`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${adminToken}` },
          });
          if (!res.ok) throw new Error("Failed to fetch submissions");
          const json = await res.json();
          setSubmissions(json);
        } catch (err) {
          console.error("Submission fetch error:", err);
          Swal.fire("Error", "Could not load submissions.", "error");
        }
      };
      fetchSubmissions();
    } else {
        setSubmissions([]);
    }
  }, [host, selectedAssignmentId]);

  // --- Handle Grade Button Click ---
  const openGradeModal = (submission) => {
    // Find the assignment details to get max marks
    const assignment = assignments.find(a => a.id === submission.assignmentId);
    
    setCurrentSubmission(submission);
    setGradeInput({
        grade: submission.grade || 0,
        feedback: submission.feedback || "",
        maxMarks: assignment ? assignment.maxMarks : 100,
    });
    setShowGradeModal(true);
  };

  // --- Handle Grade Submission ---
  const handleGradeSubmit = async (e) => {
    e.preventDefault();

    if (!currentSubmission || gradeInput.grade === null) return;
    
    if (gradeInput.grade > gradeInput.maxMarks || gradeInput.grade < 0) {
        Swal.fire("Invalid Grade", `Grade must be between 0 and ${gradeInput.maxMarks}.`, "warning");
        return;
    }

    try {
      const res = await fetch(`${host}/admin/submissions/${currentSubmission.id}/grade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          grade: parseFloat(gradeInput.grade),
          feedback: gradeInput.feedback,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit grade");

      const gradedSubmission = await res.json();
      
      // Update local submissions state immediately
      setSubmissions(submissions.map(s => 
          s.id === gradedSubmission.id ? gradedSubmission : s
      ));

      Swal.fire("Success", "Submission graded successfully!", "success");
      setShowGradeModal(false);

    } catch (err) {
      console.error("Grade submission error:", err);
      Swal.fire("Error", "Could not submit grade.", "error");
    }
  };

  const getAssignmentTitle = (id) => {
    const assignment = assignments.find(a => a.id === id);
    return assignment ? assignment.title : "Unknown Assignment";
  }
  
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

        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-400 mb-8 flex items-center gap-2">
            <FaGraduationCap className="text-purple-400" /> Check Submissions & Grade
        </h1>

        {/* --- Course and Assignment Selection --- */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Course Select */}
            <div className="relative">
                <label className="font-semibold text-lg text-gray-300 flex items-center gap-2 mb-1">
                    <FaBook /> Select Course
                </label>
                <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full mt-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white appearance-none focus:ring-indigo-500"
                    disabled={loading}
                >
                    <option value="">{loading ? "Loading..." : "--- Select a Course ---"}</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.title}
                        </option>
                    ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 mt-1 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Assignment Select */}
            <div className="relative">
                <label className="font-semibold text-lg text-gray-300 flex items-center gap-2 mb-1">
                    <FaClipboardList /> Select Assignment
                </label>
                <select
                    value={selectedAssignmentId}
                    onChange={(e) => setSelectedAssignmentId(e.target.value)}
                    className="w-full mt-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white appearance-none focus:ring-indigo-500"
                    disabled={!selectedCourseId || assignments.length === 0}
                >
                    <option value="">
                        {selectedCourseId ? (assignments.length > 0 ? "--- Select an Assignment ---" : "No Assignments Found") : "Select Course First"}
                    </option>
                    {assignments.map(assignment => (
                        <option key={assignment.id} value={assignment.id}>{assignment.title}</option>
                    ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 mt-1 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
        </div>

        {/* --- Submissions Table --- */}
        <h2 className="text-xl font-bold mb-4 text-gray-200 flex items-center gap-2">
            <FaClipboardList /> Submissions ({submissions.length})
        </h2>

        {selectedAssignmentId && submissions.length > 0 ? (
            <div className="bg-gray-800 shadow-lg rounded-2xl border border-gray-700 overflow-x-auto">
                <table className="min-w-full text-left font-sans">
                    <thead>
                        <tr className="border-b border-gray-700 bg-gray-700 text-gray-300">
                            <th className="p-4 text-sm">Student Email</th>
                            <th className="p-4 text-sm">Submitted At</th>
                            <th className="p-4 text-sm">Status</th>
                            <th className="p-4 text-sm">Grade</th>
                            <th className="p-4 text-sm">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((s) => (
                            <tr key={s.id} className="border-b border-gray-700 hover:bg-gray-700/50 text-white">
                                <td className="p-4 font-medium text-sm">{s.studentEmail}</td>
                                <td className="p-4 text-xs text-gray-400">{new Date(s.submittedAt).toLocaleString()}</td>
                                <td className={`p-4 font-semibold text-sm ${s.status === 'GRADED' ? 'text-green-400' : 'text-orange-400'}`}>
                                    {s.status}
                                </td>
                                <td className="p-4 text-sm">
                                    {s.status === 'GRADED' ? `${s.grade} / ${gradeInput.maxMarks}` : 'N/A'}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => openGradeModal(s)}
                                        className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
                                    >
                                        <FaGraduationCap /> {s.status === 'GRADED' ? 'View/Edit' : 'Grade'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
             <div className="text-center p-10 bg-gray-800 rounded-xl shadow-md text-gray-400 border border-gray-700">
                {selectedAssignmentId ? "No submissions yet for this assignment." : "Please select a course and assignment to view submissions."}
            </div>
        )}
        
        {/* ================== GRADING MODAL ================== */}
        {showGradeModal && currentSubmission && (
          // Modal background fix: overflow-y-auto added
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50 overflow-y-auto">
            
            <div className="bg-gray-800 w-full max-w-lg p-6 rounded-2xl shadow-xl relative border border-gray-700 my-8">

              {/* Close Button - FIX APPLIED HERE */}
              <button
                onClick={() => setShowGradeModal(false)} 
                className="absolute right-4 top-4 text-gray-400 hover:text-red-500 transition"
              >
                <FaTimes size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-4 text-purple-400 flex items-center">
                <FaGraduationCap className="mr-2" /> Grade Submission
              </h2>
              
              <div className="mb-4 text-gray-300">
                <p><strong>Student:</strong> {currentSubmission.studentEmail}</p>
                <p><strong>Assignment:</strong> {getAssignmentTitle(currentSubmission.assignmentId)}</p>
                <p className="font-bold text-sm text-red-400">Max Marks: {gradeInput.maxMarks}</p>
              </div>

              {/* Submission Content Link */}
              <div className="mb-4 p-4 border border-gray-600 rounded-lg bg-gray-700">
                <p className="font-semibold mb-2 text-gray-300">Submission URL:</p>
                <a 
                    href={currentSubmission.submissionUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-400 hover:underline flex items-center text-sm"
                >
                    <FaFileAlt className="mr-2" /> Open Student Work
                </a>
              </div>


              <form onSubmit={handleGradeSubmit} className="space-y-4">

                {/* Grade Input */}
                <div>
                    <label className="font-semibold text-lg text-gray-300">Grade ({`out of ${gradeInput.maxMarks}`})</label>
                    <input
                        type="number"
                        name="grade"
                        value={gradeInput.grade}
                        onChange={(e) => setGradeInput({...gradeInput, grade: e.target.value})}
                        required
                        min="0"
                        max={gradeInput.maxMarks}
                        className="w-full mt-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    />
                </div>

                {/* Feedback */}
                <div>
                    <label className="font-semibold text-lg text-gray-300">Feedback</label>
                    <textarea
                        name="feedback"
                        value={gradeInput.feedback}
                        rows="4"
                        onChange={(e) => setGradeInput({...gradeInput, feedback: e.target.value})}
                        required
                        className="w-full mt-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold text-xl hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  <FaSave /> Save Grade
                </button>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminCheckSubmission;