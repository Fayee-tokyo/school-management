import { Routes, Route } from 'react-router-dom';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';

// Admin pages and layout
import AdminLayout from './components/AdminLayout';
import AdminHome from './pages/AdminHome';
import AdminStudentDashboard from './components/AdminStudentDashboard';
import AdminDashboard from './components/AdminDashboard'; // Teacher Management page
import AdminCourseDashboard from './components/AdminCourseDashboard';
import EnrollStudentForm from './components/EnrollStudentForm';

// ProtectedRoute wrapper
import ProtectedRoute from './components/ProtectedRoute';

// Role-specific dashboards
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';
import TeacherCourses from './components/TeacherCourses';

function App() {
  return (
    <Routes>

      {/* 🌐 Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* 🔐 Admin Routes - Protected + Uses Sidebar Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="students" element={<AdminStudentDashboard />} />
        <Route path="teachers" element={<AdminDashboard />} /> {/* Teacher Management */}
        <Route path="courses" element={<AdminCourseDashboard />} />
        <Route path="enrollments" element={<EnrollStudentForm/>} />
      </Route>

      {/* 👨‍🏫 Teacher Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['Teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/courses"
        element={
          <ProtectedRoute allowedRoles={['Teacher']}>
            <TeacherCourses />
          </ProtectedRoute>
        }
      />

      {/* 🎓 Student Route */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['Student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* 👪 Parent Route */}
      <Route
        path="/parent/dashboard"
        element={
          <ProtectedRoute allowedRoles={['Parent']}>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />

      {/* ❗ Catch-All Route */}
      <Route path="*" element={<Unauthorized />} />
    </Routes>
  );
}

export default App;
