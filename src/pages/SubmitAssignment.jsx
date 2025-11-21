import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Data from '../store/Data';
import Swal from 'sweetalert2';
import { FaFileUpload, FaClipboardList, FaSpinner, FaGraduationCap, FaLink, FaClock, FaArrowLeft } from 'react-icons/fa';
import SideMenu from '../components/SideMenu'; 

const SubmitAssignment = () => {
    const { host } = Data();
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("authtoken");

    const [assignment, setAssignment] = useState(null);
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchAssignmentDetails = useCallback(async () => {
        if (!token) {
            setError("Authentication token missing.");
            setLoading(false);
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            // Assume the API endpoint for fetching a single assignment is GET /assignments/{id}
            const res = await fetch(`${host}/assignments/${assignmentId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: "Failed to load assignment details." }));
                throw new Error(errorData.message || `Failed to load assignment with status ${res.status}.`);
            }
            
            const data = await res.json();
            // Set the received assignment data
            setAssignment(data);
            
        } catch (err) {
            console.error("Assignment fetch error:", err);
            setError(err.message || "An unknown error occurred while fetching assignment.");
        } finally {
            setLoading(false);
        }
    }, [assignmentId, host, token]); // Dependencies updated to include host and token

    useEffect(() => {
        if (assignmentId) {
            fetchAssignmentDetails();
        } else {
            setError("Assignment ID not provided in the URL.");
            setLoading(false);
        }
    }, [assignmentId, fetchAssignmentDetails]);


    // --- Submission Handler (No changes needed, as it was already using the API) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            Swal.fire('Error', 'You must be logged in to submit.', 'error');
            return;
        }

        setSubmitting(true);
        const payload = { submissionUrl };

        try {
            // API call: POST /assignments/{assignmentid}/submit
            const res = await fetch(`${host}/assignments/${assignmentId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: "Submission failed." }));
                throw new Error(errorData.message || `Submission failed with status ${res.status}.`);
            }

            Swal.fire('Success!', 'Your submission link has been saved.', 'success');
            
            navigate(-1); 

        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };


    const loadingOrErrorScreen = (text, color = 'text-gray-400') => (
        <div className="flex bg-slate-900 min-h-screen">
            <SideMenu isDarkTheme={true} />
            <div className="flex-1 p-10 text-center text-xl" style={{ paddingTop: '100px' }}>
                <p className={color}>{text}</p>
            </div>
        </div>
    );

    if (loading) {
        return loadingOrErrorScreen("Loading Assignment Details...");
    }

    if (error || !assignment) {
        return loadingOrErrorScreen(error || "Could not retrieve assignment details.", "text-red-400");
    }

    // --- Main Component Render (Styled for Dark Theme) ---
    return (
        <div className="flex bg-slate-900 min-h-screen overflow-hidden">
            
            <div className="w-64 flex-shrink-0">
                <SideMenu isDarkTheme={true} />
            </div>
            
            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto py-4">

                    {/* Back Button */}
                    <button 
                        onClick={() => navigate(-1)}
                        className="mb-6 text-gray-400 hover:text-indigo-400 transition flex items-center gap-2"
                    >
                        <FaArrowLeft /> Back to Assignments
                    </button>

                    {/* Main Title */}
                    <h1 className="text-3xl font-bold text-indigo-400 mb-2 flex items-center">
                        <FaClipboardList className="mr-3" /> Submit: {assignment.title}
                    </h1>
                    
                    {/* Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 border-b border-slate-700 pb-4">
                        {/* Ensure these properties exist on the returned assignment object */}
                        <span className="flex items-center gap-1"><FaGraduationCap /> Max Marks: {assignment.maxMarks || 'N/A'}</span>
                        <span className="flex items-center gap-1"><FaClock /> Due Date: {assignment.dueDate || 'N/A'}</span>
                    </div>

                    {/* --- Submission Instructions Card --- */}
                    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 mb-8">
                        <h2 className="text-xl font-bold text-white mb-3">Instructions</h2>
                        {/* Use the description returned from the API */}
                        <p className="text-gray-300 whitespace-pre-wrap">{assignment.description || 'No instructions provided.'}</p>
                    </div>

                    {/* --- Submission Form Card --- */}
                    <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-indigo-600">
                        <h2 className="text-2xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
                            <FaFileUpload /> Submit Your File Link
                        </h2>
                        <p className="text-sm text-red-400 mb-4">
                            *Please upload your PDF/DOC file to a cloud service (e.g., Drive, Dropbox) and paste the **shareable link** below. Ensure the link permissions are set correctly.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            <div>
                                <label htmlFor="submissionUrl" className="font-semibold text-gray-300 flex items-center gap-2 mb-1">
                                    <FaLink /> Shareable File Link (PDF/DOC)
                                </label>
                                <input
                                    id="submissionUrl"
                                    type="url"
                                    required
                                    placeholder="https://drive.google.com/..."
                                    value={submissionUrl}
                                    onChange={(e) => setSubmissionUrl(e.target.value)}
                                    disabled={submitting}
                                    className="w-full p-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || submissionUrl.trim() === ''}
                                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-500 transition disabled:bg-gray-600 disabled:text-gray-400 flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <><FaSpinner className="animate-spin" /> Submitting...</>
                                ) : (
                                    <><FaFileUpload /> Confirm Submission</>
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SubmitAssignment;