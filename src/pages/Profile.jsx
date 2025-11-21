import React, { useEffect, useState, useCallback } from 'react';
import Data from '../store/Data';
import SideMenu from '../components/SideMenu'; 
import Swal from 'sweetalert2';
import { FaUserCircle, FaEnvelope, FaUserTag, FaBook, FaSpinner, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const { host } = Data();
  // ✅ FIX: Using lowercase 'authtoken' as requested
  const token = localStorage.getItem("authtoken"); 
  const localUsername = localStorage.getItem("username"); 
  const localRole = localStorage.getItem("role");
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchProfileData = useCallback(async () => {
    if (!token) {
      setError('Authentication required. Please log in.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${host}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
            throw new Error(`Failed to fetch profile: Status ${res.status}`);
      } else {
          const data = await res.json();
          setProfileData(data);
          setFormData({ name: data.name, email: data.email }); 
      }

    } catch (err) {
      console.error("Profile Fetch Error:", err);
      setError(err.message || 'Error fetching profile data.');
    } finally {
      setLoading(false);
    }
  }, [host, token, localUsername, localRole]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);
  

  const handleUpdateProfile = async (e) => {
      e.preventDefault();
      
      Swal.fire({
          icon: 'info',
          title: 'Update Feature',
          text: 'Profile update functionality is not yet implemented on the backend. Data: ' + JSON.stringify(formData),
      });
      setIsEditing(false);
  };
  
  const handleFormChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  if (loading) {
    return <div className="p-10 text-center text-xl text-gray-400 bg-gray-900">Loading Profile...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-xl text-red-400 bg-gray-900">Error: {error}</div>;
  }
  
  const user = profileData;

  return (
    // 🎨 FIX 1: Apply bg-gray-900 background to the main container
    <div className="flex bg-gray-900 min-h-screen">
        <div className="w-64 flex-shrink-0">
            {/* NOTE: SideMenu should be dark theme compatible */}
            <SideMenu />
        </div>
        
        <div className="flex-1 p-4 md:p-8 font-sans">
            {/* 🎨 FIX 2: Light title color */}
            <h1 className="text-3xl font-bold text-indigo-400 mb-8 flex items-center">
                <FaUserCircle className="mr-3" /> User Profile
            </h1>

            {/* 🎨 FIX 3: Dark container background for content */}
            <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
                
                <div className="flex justify-between items-start mb-6 border-b border-gray-700 pb-4">
                    {/* 🎨 FIX 4: Light text color */}
                    <h2 className="text-2xl font-semibold text-gray-200">Account Information</h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${isEditing ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                    >
                        {isEditing ? <FaTimes /> : <FaEdit />} {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                <form onSubmit={handleUpdateProfile}>
                    <div className="space-y-6">
                        
                        {/* Full Name */}
                        <ProfileRow 
                            label="Full Name" 
                            icon={<FaUserCircle />} 
                            value={user.name || 'N/A'}
                            isEditing={isEditing}
                            name="name" 
                            formData={formData}
                            onChange={handleFormChange}
                        />

                        {/* Email (Read-only) */}
                        <ProfileRow 
                            label="Email" 
                            icon={<FaEnvelope />} 
                            value={user.email}
                            readOnly={true}
                        />

                        {/* Role (Read-only) */}
                        <ProfileRow 
                            label="Role" 
                            icon={<FaUserTag />} 
                            value={user.role || 'Student'}
                            readOnly={true}
                        />
                        <ProfileRow 
                            label="Courses Enrolled" 
                            icon={<FaBook />} 
                            value={`${user.enrolledCourse ? user.enrolledCourse.length : 0} Courses`} 
                            readOnly={true}
                        />

                    </div>
                    
                    {isEditing && (
                        <div className="mt-8 pt-6 border-t border-gray-700">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2"
                            >
                                <FaCheck /> Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    </div>
  );
};


const ProfileRow = ({ label, icon, value, isEditing = false, name, formData, onChange, readOnly = false }) => (
    <div className="flex flex-col md:flex-row items-start md:items-center py-3 border-b border-gray-700 last:border-b-0">
        
        {/* 🎨 FIX 5: Dark theme text and icon color */}
        <div className="w-full md:w-1/3 text-gray-400 flex items-center gap-2 mb-2 md:mb-0">
            <span className="text-indigo-400">{icon}</span>
            <span className="font-semibold">{label}:</span>
        </div>

        <div className="w-full md:w-2/3">
            {isEditing && !readOnly ? (
                <input
                    type="text"
                    name={name}
                    value={formData[name] || ''}
                    onChange={onChange}
                    // 🎨 FIX 6: Dark input styling
                    className="w-full p-2 border border-gray-600 rounded-lg focus:ring-indigo-500 bg-gray-700 text-white"
                    required
                />
            ) : (
                <span className="text-gray-200 text-lg">{value}</span>
            )}
        </div>
    </div>
);

export default Profile;