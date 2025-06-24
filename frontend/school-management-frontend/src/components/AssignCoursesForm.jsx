// src/components/AssignCoursesForm.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { authHeader } from '../services/AuthService';

export default function AssignCoursesForm({ onClose, onSuccess }) {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [teacherRes, courseRes] = await Promise.all([
        axios.get('http://localhost:5293/api/admin/teachers', {
          headers: authHeader()
        }),
        axios.get('http://localhost:5293/api/admin/courses', {
          headers: authHeader()
        })
      ]);
      setTeachers(teacherRes.data);
      setCourses(courseRes.data);
    } catch (err) {
      console.error('❌ Failed to fetch data:', err);
      setError('Failed to load teachers or courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeacherId || selectedCourseIds.length === 0) {
      alert('Please select a teacher and at least one course.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5293/api/admin/assign-courses',
        {
          teacherId: selectedTeacherId,
          courseIds: selectedCourseIds
        },
        { headers: authHeader() }
      );
      alert('✅ Courses successfully assigned!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('❌ Error assigning courses:', err.response?.data || err);
      alert('Failed to assign courses.');
    }
  };

  const toggleCourseSelection = (id) => {
    setSelectedCourseIds(prev =>
      prev.includes(id)
        ? prev.filter(cid => cid !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Assign Courses to Teacher</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Teacher Select */}
            <div>
              <label className="block font-semibold mb-1">Select Teacher</label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">-- Choose a Teacher --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.userId}>
                    {t.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Multi-select */}
            <div>
              <label className="block font-semibold mb-1">Select Courses</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
                {courses.map(c => (
                  <label key={c.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={c.id}
                      checked={selectedCourseIds.includes(c.id)}
                      onChange={() => toggleCourseSelection(c.id)}
                    />
                    <span>{c.title}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Assign
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
