
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function TeacherSidebarLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-5 space-y-4">
        <h2 className="text-xl font-bold mb-6">Teacher Panel</h2>

        <nav className="space-y-3">
          <Link to="/teacher/dashboard" className="block hover:text-yellow-400">
            🏫 Dashboard
          </Link>
          <Link to="/teacher/mark-attendance" className="block hover:text-yellow-400">
            📅 Mark Attendance
          </Link>
          <Link to="/teacher/mark-grade" className="block hover:text-yellow-400">
            ✏️ Mark Grades
          </Link>
          <Link to="/teacher/courses" className="block hover:text-yellow-400">
            📚 My Courses
          </Link>
          <button onClick={handleLogout} className="mt-4 text-red-400 hover:text-red-600">
            🚪 Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
