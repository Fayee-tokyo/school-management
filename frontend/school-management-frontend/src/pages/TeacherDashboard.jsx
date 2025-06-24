import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { authHeader } from '../services/AuthService';

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>

      {courses.length === 0 ? (
        <p className="text-gray-600">No courses assigned yet.</p>
      ) : (
        <>
          <p className="mb-4 text-green-700 font-medium">Welcome! Here are your assigned courses:</p>
          <ul className="list-disc pl-6">
            {courses.map((course) => (
              <li key={course.id} className="mb-2">
                {course.title}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
 