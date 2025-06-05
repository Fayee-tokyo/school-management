import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Navigationbar from './components/Navigationbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <>
      <Navigationbar />
      <main style={{minHeight: '80vh',padding: '2rem'}}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register/>} />
        <Route path ="/login" element ={<Login />} />
        <Route path ="/unauthorized" element={<unauthorized/>}/>

        {/*Admin only*/}
        <Route
        path ="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard/>
          </ProtectedRoute>
        }
        />

          {/* Teacher only */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

           {/* Student only */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

           {/* Parent only */}
          <Route
            path="/parent/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Parent']}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback if no route matched */}
          <Route path="*" element={<Unauthorized />} />
         </Routes>
         </main>
        </>
  );
};
export default App

