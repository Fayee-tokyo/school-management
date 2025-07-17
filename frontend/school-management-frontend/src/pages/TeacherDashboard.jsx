import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EnrolledStudentsList from '../components/EnrolledStudentsList';
import { authHeader } from '../services/AuthService';
import '../styles/TeacherDashboard.css'; 

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5293/api/teacher/courses', {
          headers: authHeader(),
        });
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to load courses:', err);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>👩‍🏫 Teacher Dashboard</h1>
        <p>Welcome! Below are your assigned courses and enrolled students.</p>
      </div>

      <div className="dashboard-section">
        <h2>📚 Assigned Courses</h2>
        {courses.length === 0 ? (
          <p className="empty-msg">No courses assigned yet.</p>
        ) : (
          <ul className="course-list">
            {courses.map((course) => (
              <li key={course.id} className="course-card">
                <strong>{course.title}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dashboard-section">
        <h2>👥 Enrolled Students</h2>
        <EnrolledStudentsList />
      </div>
    </div>
  );
}
