import { useEffect, useState } from 'react';
import axios from 'axios';
import { authHeader } from '../services/AuthService';

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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">My Assigned Courses</h1>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">No courses assigned.</p>
      ) : (
        <table className="w-full border shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Course Title</th>
              <th className="p-2 border">Course ID</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="p-2 border">{course.title}</td>
                <td className="p-2 border">{course.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
