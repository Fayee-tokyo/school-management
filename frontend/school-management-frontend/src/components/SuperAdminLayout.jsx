import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/SuperAdminLayout.css";
import { useEffect } from "react";

export default function SuperAdminLayout() {
  const navigate = useNavigate();

  // Optional: Redirect to dashboard by default
  useEffect(() => {
    if (window.location.pathname === "/superadmin") {
      navigate("/superadmin/dashboard");
    }
  }, [navigate]);

  return (
    <div className="superadmin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">SuperAdmin</div>
        <nav className="nav-links">
          <Link to="/superadmin/dashboard">Dashboard</Link>
          <Link to="/superadmin/manage-admins">Manage Admins</Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-content">
            <span>Welcome, Super Admin</span>
            <button className="logout-btn">Logout</button>
          </div>
        </header>

        {/* Page content area */}
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
