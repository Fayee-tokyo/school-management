// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>🎓 MySchool</div>
        <nav className={styles.nav}>
          <Link to="/login" className={styles.navLink}>Login</Link>
          <Link to="/register" className={styles.navLink}>Register</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Welcome to MySchool Management System</h1>
        <p>Your digital solution for seamless student, parent, teacher, and admin coordination.</p>
        <Link to="/register" className={styles.ctaButton}>Get Started</Link>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <h3>🧑‍🎓 Students</h3>
          <p>Access grades, timetables, and school resources online.</p>
        </div>
        <div className={styles.featureCard}>
          <h3>👩‍🏫 Teachers</h3>
          <p>Manage student performance and streamline communication.</p>
        </div>
        <div className={styles.featureCard}>
          <h3>👪 Parents</h3>
          <p>Stay connected with your child’s academic journey.</p>
        </div>
        <div className={styles.featureCard}>
          <h3>🛠️ Admin</h3>
          <p>Oversee users, data, and system performance in one place.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2025 MySchool. All rights reserved.</p>
      </footer>
    </div>
  );
}
