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
    <div style={styles.container}>
      {/* Navigation Bar */}
      <nav style={styles.nav}>
        <h1 style={styles.logo}>ADMIN PANEL</h1>
        <div style={styles.links}>
          <Link
            to="/admin/students"
            style={{
              ...styles.link,
              ...(isActive('/admin/students') ? styles.active : {})
            }}
          >
            Students
          </Link>
          <Link
            to="/admin/teachers"
            style={{
              ...styles.link,
              ...(isActive('/admin/teachers') ? styles.active : {})
            }}
          >
            Teachers
          </Link>
          <Link
            to="/admin/courses"
            style={{
              ...styles.link,
              ...(isActive('/admin/courses') ? styles.active : {})
            }}
          >
            Courses
          </Link>
          <Link
            to="/admin/enrollments"
            style={{
              ...styles.link,
              ...(isActive('/admin/enrollments') ? styles.active : {})
            }}
          >
            Enrollments
          </Link>
          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Content Area */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    background: '#2c3e50',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    alignItems: 'center',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '1.2rem',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '0.95rem',
  },
  active: {
    borderBottom: '2px solid white',
  },
  logout: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  main: {
    padding: '2rem',
    flex: 1,
    overflowY: 'auto',
  },
};
