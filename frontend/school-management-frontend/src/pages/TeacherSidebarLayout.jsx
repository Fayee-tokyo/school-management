import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "../styles/TeacherSidebarLayout.module.css"; 

export default function TeacherSidebarLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
        <button className={styles.toggleBtn} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "☰" : "✕"}
        </button>

        <div className={styles.menu}>
          <NavLink to="/teacher/dashboard" className={styles.link}>
            📊 {collapsed ? "" : "Dashboard"}
          </NavLink>
          <NavLink to="/teacher/courses" className={styles.link}>
            📚 {collapsed ? "" : "My Courses"}
          </NavLink>
          <NavLink to="/teacher/mark-attendance" className={styles.link}>
            📝 {collapsed ? "" : "Mark Attendance"}
          </NavLink>
          <NavLink to="/teacher/mark-grade" className={styles.link}>
            🎓 {collapsed ? "" : "Mark Grades"}
          </NavLink>
          <button onClick={handleLogout} className={styles.link}>
            🚪 {collapsed ? "" : "Logout"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
