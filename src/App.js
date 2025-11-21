
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import AdminHome from './pages/AdminHome';
import AdminProt from './pages/AdminProt';
import AdminLogin from './pages/AdminLogin';
import AdminAddCourse from './pages/AdminAddCourse';
import AdminUpdateCourse from './pages/AdminUpdateCourse';
import AdminDeleteCourse from './pages/AdminDeleteCourse';
import AdminAddAssignment from './pages/AdminAddAssignment';
import AdminCheckSubmission from './pages/AdminCheckSubmission';
import AdminAddLectures from './pages/AdminAddLectures';
import CourseDetails from './pages/CourseDetails';
import Lectures from './pages/Lectures';
import Search from './pages/Search';
import Assignment from './pages/Assignment';
import SubmitAssignment from './pages/SubmitAssignment';
import Profile from './pages/Profile';
import { Home, LogOut } from 'lucide-react';
import Logout from './pages/Logout';
import StudentProtected from './pages/StudentProtected';
import AdminUpdateDeleteLecture from './pages/AdminUpdateDeleteLecture';
import MyCourses from './pages/MyCourses';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/student/login' element={<Login/>}></Route>
          <Route path='/student/signup' element={<Signup/>}></Route>
          <Route path='/student/dashboard' element={<StudentProtected><StudentDashboard/></StudentProtected>}></Route>
          <Route path='/admin/home' element={<AdminProt><AdminHome/></AdminProt>}></Route>
          <Route path='/admin/login' element={<AdminProt> <AdminLogin/> </AdminProt>}></Route>
          <Route path='/admin/addcourse' element={<AdminProt><AdminAddCourse></AdminAddCourse></AdminProt>}></Route>
          <Route path='/admin/updatecourse' element={<AdminProt><AdminUpdateCourse></AdminUpdateCourse></AdminProt>}></Route>
          <Route path='/admin/deletecourse' element={<AdminProt><AdminDeleteCourse/></AdminProt>}></Route>
          <Route path='/admin/addassignment' element={<AdminProt><AdminAddAssignment></AdminAddAssignment></AdminProt>}></Route>
          <Route path='/admin/check' element={<AdminProt><AdminCheckSubmission></AdminCheckSubmission></AdminProt>}></Route>
          <Route path='/admin/addlecture' element={<AdminProt><AdminAddLectures></AdminAddLectures></AdminProt>}></Route>
          <Route path='/student/coursedetails/:id' element={<CourseDetails></CourseDetails>}></Route>
          <Route path='/lecture/:id' element={<Lectures/>}></Route>
          <Route path='/search' element={<Search/>}></Route>
          <Route path='/assignment' element={<Assignment/>}></Route>
          <Route path='/assignments/:assignmentId/submit' element={<SubmitAssignment/>}></Route> 
          <Route path='/profile' element={<Profile/>}></Route>
          <Route path='/logout' element={<Logout/>}></Route>
          <Route path='/' element={<StudentProtected><Home></Home></StudentProtected>}> </Route>
          <Route path='/mycourses' element={<MyCourses/>}></Route>
          <Route path='/admin/update-delete-lecture' element={<AdminProt><AdminUpdateDeleteLecture/></AdminProt>}></Route>
        </Routes>
      </Router>
    </>


  );
}

export default App;
