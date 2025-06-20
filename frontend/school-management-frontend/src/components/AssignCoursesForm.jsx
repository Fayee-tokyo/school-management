// src/components/AssignCoursesForm.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { authHeader } from '../services/AuthService';

export default function AssignCoursesForm({ onClose, onSuccess }) {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);

  useEffect(() => {
    fetchTeachers();
    fetchCourses();
  }, []);

  const fetchTeachers = async () => {
    const res = await axios.get('http://localhost:5293/api/admin/teachers', {
      headers: authHeader()
    });
    setTeachers(res.data);
  };

  const fetchCourses = async () => {
    const res = await axios.get('http://localhost:5293/api/courses', {
      headers: authHeader()
    });
    setCourses(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5293/api/admin/assign-courses',
        {
          teacherId: selectedTeacherId,
          courseIds: selectedCourseIds
        },
        { headers: authHeader() }
      );
      alert('Courses successfully assigned!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error assigning courses:', err.response?.data || err);
      alert('Failed to assign courses.');
    }
  };

  const toggleCourseSelection = (id) => {
    if (selectedCourseIds.includes(id)) {
      setSelectedCourseIds(selectedCourseIds.filter(cid => cid !== id));
    } else {
      setSelectedCourseIds([...selectedCourseIds, id]);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Assign Courses to Teacher</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Select Teacher</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Select Teacher --</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.fullName}</option>
              ))}
            </select>
          </div>

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
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
