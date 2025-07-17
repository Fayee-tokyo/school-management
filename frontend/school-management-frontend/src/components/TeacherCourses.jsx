import { useEffect, useState } from 'react';
import axios from 'axios';
import { authHeader } from '../services/AuthService';
import '../styles/TeacherCourses.css';

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5293/api/teacher/courses', {
        headers: authHeader(),
      });
      setCourses(res.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      alert('Error loading your assigned courses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-courses-container">
      <h1 className="section-header">My Assigned Courses</h1>

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <div className="card-container">
          <p>You are not assigned to any course yet.</p>
        </div>
      ) : (
        <div className="card-container">
          <p style={{ color: '#15803d', fontWeight: '500', marginBottom: '1rem' }}>
            Below is a list of courses assigned to you:
          </p>
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <h2 className="course-title">{course.title}</h2>
              <p className="course-id">Course ID: {course.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

