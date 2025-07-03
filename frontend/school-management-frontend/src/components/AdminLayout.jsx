import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/AuthService';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md px-10 py-4 flex items-center justify-between">
        {/* Left: Admin Panel title + links */}
        <div className="flex items-center gap-12">
          <h1 className="text-2xl font-semibold text-blue-700">Admin Panel</h1>
          <div className="flex gap-8 text-sm text-gray-700">
            <Link
              to="/admin/students"
              className={`hover:text-blue-700 transition ${
                isActive('/admin/students') && 'text-blue-700 font-semibold border-b-2 border-blue-700'
              }`}
            >
              Students
            </Link>
            <Link
              to="/admin/teachers"
              className={`hover:text-blue-700 transition ${
                isActive('/admin/teachers') && 'text-blue-700 font-semibold border-b-2 border-blue-700'
              }`}
            >
              Teachers
            </Link>
            <Link
              to="/admin/courses"
              className={`hover:text-blue-700 transition ${
                isActive('/admin/courses') && 'text-blue-700 font-semibold border-b-2 border-blue-700'
              }`}
            >
              Courses
            </Link>
            <Link
              to="/admin/enrollments"
              className={`hover:text-blue-700 transition ${
                isActive('/admin/enrollments') && 'text-blue-700 font-semibold border-b-2 border-blue-700'
              }`}
            >
              Enrollments
            </Link>
          </div>
        </div>

        {/* Right: Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm transition"
        >
          Logout
        </button>
      </nav>

      {/* Content Area */}
      <main className="p-6 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
