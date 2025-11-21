import React, { useEffect, useState } from "react";
import { 
  FaBook, FaUsers, FaTasks, FaCheckCircle, 
  FaPlus, FaEdit, FaTrash, FaChalkboardTeacher, 
  FaArrowRight 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import AdminSideMenu from "../components/AdminSideMenu";
import Data from "../store/Data";

const AdminDashboardHome = () => {

  const { host } = Data();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    assignment: 0,
    courseByCategory: {}
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${host}/admin/dashboard-data`,{
            method:"GET",
            headers:{
                "Content-type":"application/json",
                "Authorization":`Bearer ${localStorage.getItem("adminToken")}`
            }
        });
        const json = await res.json();
        setStats(json);
      } catch (err) {
        console.log("Dashboard Fetch Error:", err);
      }
    };

    fetchDashboard();
  }, [host]);

  const quickActions = [
    { icon: <FaPlus />, text: "Add Course", path: "/admin/addcourse" },
    { icon: <FaEdit />, text: "Update Course", path: "/admin/updatecourse" },
    { icon: <FaTrash />, text: "Delete Course", path: "/admin/deletecourse" },
    { icon: <FaTasks />, text: "Add Assignment", path: "/admin/addassignment" },
    { icon: <FaChalkboardTeacher />, text: "Add Lecture", path: "/admin/addlecture" },
    { icon: <FaEdit />, text: "Update/Delete Lecture", path: "/admin/update-delete-lecture" }, 
    { icon: <FaUsers />, text: "Check Submissions", path: "/admin/check" },
    { icon: <FaCheckCircle />, text: "Give Grades", path: "/admin/check" },
  ];

  const handleActionClick = (path) => {
    navigate(path);
  };

  return (
    // 🎨 FIX 1: Change main background to complement dark sidebar
    <div className="flex bg-gray-800 h-screen overflow-hidden"> 

      {/* Sidebar Fixed */}
      {/* 🎨 NOTE: Width is 72 for the redesigned sidebar */}
      <div className="w-72 h-full fixed left-0 top-0"> 
        <AdminSideMenu />
      </div>

      {/* Main Dashboard */}
      {/* 🎨 NOTE: ml-72 to match new sidebar width */}
      <div className="flex-1 ml-72 p-6 overflow-y-auto font-sans"> 

        {/* 🎨 FIX 2: Change title color to white/light for dark background */}
        <h1 className="text-3xl font-bold mb-6 text-white"> 
          Admin Dashboard
        </h1>

        {/* ========== STATS TOP CARDS ========== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {/* StatCards keep bg-white for contrast */}
          <StatCard 
            icon={<FaBook className="text-indigo-400 text-4xl" />}
            number={stats.courses}
            label="Total Courses"
          />

          <StatCard 
            icon={<FaUsers className="text-green-500 text-4xl" />}
            number={stats.users}
            label="Students Enrolled"
          />

          <StatCard 
            icon={<FaTasks className="text-purple-400 text-4xl" />}
            number={stats.assignment}
            label="Assignments"
          />

          <StatCard 
            icon={<FaCheckCircle className="text-red-500 text-4xl" />}
            number="12"
            label="Pending Grading"
          />

        </div>

        {/* ========== COURSES BY CATEGORY ========== */}
        {/* 🎨 FIX 3: Change secondary header color */}
        <h2 className="text-xl font-bold mb-4 text-gray-200">Courses by Category</h2>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 mb-10">
          <ul className="space-y-2">
            {Object.entries(stats.courseByCategory).map(([category, count]) => (
              <li key={category} className="flex justify-between text-gray-700 font-medium">
                <span>{category}</span>
                <span>{count}</span>
              </li>
            ))}
          </ul>
        </div>


       
        <h2 className="text-xl font-bold mb-4 text-gray-200">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {quickActions.map((action, index) => (
                <ActionCard 
                    key={index}
                    icon={action.icon} 
                    text={action.text} 
                    onClick={() => handleActionClick(action.path)}
                />
            ))}
        </div>



        

      </div>
    </div>
  );
};


/* ===================== REUSABLE COMPONENTS ===================== */
// These components use bg-white for contrast and should remain light.

const StatCard = ({ icon, number, label }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex items-center gap-4">
    {icon}
    <div>
      <h2 className="text-2xl font-semibold">{number}</h2>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  </div>
);

const ActionCard = ({ icon, text, onClick }) => (
  <div 
    className="bg-white border border-gray-300 p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-4"
    onClick={onClick}
  >
    <div className="text-indigo-600 text-3xl">{icon}</div>
    <span className="text-lg font-semibold">{text}</span>
  </div>
);

const ActivityItem = ({ text }) => (
  <li className="text-gray-700 flex items-center justify-between">
    <span>{text}</span>
    <FaArrowRight className="text-indigo-600" /> 
  </li>
);

const TableRow = ({ student, course, assignment, status, color }) => (
  <tr className="border-b">
    <td className="p-3">{student}</td>
    <td className="p-3">{course}</td>
    <td className="p-3">{assignment}</td>
    <td className={`p-3 font-semibold ${color}`}>{status}</td>
  </tr>
);

export default AdminDashboardHome;