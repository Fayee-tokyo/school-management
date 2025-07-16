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

// Teacher layout and pages
import TeacherSidebarLayout from './pages/TeacherSidebarLayout';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherCourses from './components/TeacherCourses';
import MarkAttendance from './pages/MarkAttendance';
import MarkGrade from './pages/MarkGrade';

// Student and Parent pages
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';

// ProtectedRoute wrapper
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* 🌐 Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* 🔐 Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="students" element={<AdminStudentDashboard />} />
        <Route path="teachers" element={<AdminDashboard />} />
        <Route path="courses" element={<AdminCourseDashboard />} />
        <Route path="enrollments" element={<EnrollStudentForm />} />
      </Route>

      {/* 👨‍🏫 Teacher Routes - All wrapped in TeacherSidebarLayout */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['Teacher']}>
            <TeacherSidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="courses" element={<TeacherCourses />} />
        <Route path="mark-attendance" element={<MarkAttendance />} />
        <Route path="mark-grade" element={<MarkGrade/>}/>
      </Route>

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

      {/* ❗ Catch-All */}
      <Route path="*" element={<Unauthorized />} />
    </Routes>
  );
}

export default App;
