// src/components/AdminCourseDashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { authHeader } from '../services/AuthService';
import AddCourseForm from './AddCourseForm';
import EditCourseForm from './EditCourseForm';

export default function AdminCourseDashboard() {
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null); // Track course being edited

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5293/api/admin/courses', {
        headers: authHeader()
      });
      setCourses(res.data);
    } catch (err) {
      console.error('Error loading courses:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Course Management</h2>

      <AddCourseForm onSuccess={fetchCourses} />

      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Existing Courses</h3>
        {courses.length === 0 ? (
          <p>No courses added yet.</p>
        ) : (
          <ul className="space-y-2">
            {courses.map((course) => (
              <li
                key={course.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{course.title}</span>
                <button
                  onClick={() => setEditingCourseId(course.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Modal */}
      {editingCourseId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
            <h3 className="text-xl font-semibold mb-4">Edit Course</h3>
            <EditCourseForm
              courseId={editingCourseId}
              onClose={() => setEditingCourseId(null)}
              onUpdated={fetchCourses}
            />
          </div>
        </div>
      )}
    </div>
  );
}
