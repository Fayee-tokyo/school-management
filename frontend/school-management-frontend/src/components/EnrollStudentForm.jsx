import { useEffect, useState } from "react";
import axios from "axios";
import { authHeader } from "../services/AuthService";

export default function EnrollStudentForm({ onSuccess, studentId: propStudentId, onClose }) {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(propStudentId || "");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [sRes, cRes] = await Promise.all([
          axios.get("http://localhost:5293/api/admin/students-dropdown", { headers: authHeader() }),
          axios.get("http://localhost:5293/api/admin/courses-dropdown", { headers: authHeader() })
        ]);
        setStudents(sRes.data);
        setCourses(cRes.data);
      } catch (err) {
        console.error("Failed to fetch data for enrollment form:", err);
        setError("Failed to load students or courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshSelectedStudentEnrollments = async () => {
    if (!selectedStudent) {
      setEnrolledCourses([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5293/api/admin/enrollments`, {
        headers: authHeader()
      });
      const studentEnrollment = res.data.find(s => s.studentId === parseInt(selectedStudent));
      setEnrolledCourses(studentEnrollment ? studentEnrollment.courses : []);
    } catch (err) {
      console.error("Failed to refresh enrolled courses:", err);
      setError("Failed to load enrolled courses for selected student.");
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      refreshSelectedStudentEnrollments();
    }
  }, [selectedStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || selectedCourses.length === 0) {
      alert("Please select a student and at least one course.");
      return;
    }

    try {
      await axios.post("http://localhost:5293/api/admin/enroll-student", {
        studentId: parseInt(selectedStudent),
        courseIds: selectedCourses.map(id => parseInt(id))
      }, {
        headers: authHeader()
      });

      alert("Student enrolled successfully!");
      setSelectedCourses([]);
      if (onSuccess) onSuccess();
      refreshSelectedStudentEnrollments();
    } catch (err) {
      console.error("Enrollment failed:", err.response?.data || err.message);
      alert("Failed to enroll student. Check console for details.");
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!window.confirm("Are you sure you want to unenroll this student from the course?")) return;

    try {
      await axios.delete(`http://localhost:5293/api/admin/students/${selectedStudent}/unenroll/${courseId}`, {
        headers: authHeader()
      });

      alert("Unenrolled successfully!");
      refreshSelectedStudentEnrollments();
    } catch (err) {
      console.error("Unenrollment failed:", err.response?.data || err.message);
      alert("Failed to unenroll. Check console for details.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading enrollment form...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full space-y-6 transform transition-all duration-300 scale-95 opacity-0 animate-scale-in"
      >
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800">Enroll Student in Courses</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none font-bold"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="student-select" className="block text-gray-700 text-sm font-medium mb-1">
              Select Student:
            </label>
            <select
              id="student-select"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={!!propStudentId}
            >
              <option value="">-- Choose Student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName}
                </option>
              ))}
            </select>
          </div>

          {selectedStudent && enrolledCourses.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-md shadow-inner">
              <h4 className="font-semibold text-blue-800 mb-2">Currently Enrolled Courses:</h4>
              <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                {enrolledCourses.map((course) => (
                  <li key={course.courseId} className="flex justify-between items-center py-1">
                    <span>
                      {course.title} —
                      <span className="italic text-xs text-gray-600 ml-1">
                        Teacher: {course.teacherName || 'N/A'}
                      </span>
                    </span>
                    <button
                      onClick={() => handleUnenroll(course.courseId)}
                      className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold hover:bg-red-200 transition-colors"
                      type="button"
                    >
                      Unenroll
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label htmlFor="courses-select" className="block text-gray-700 text-sm font-medium mb-1">
              Select Courses to Enroll:
            </label>
            <select
              id="courses-select"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              multiple
              value={selectedCourses}
              onChange={(e) =>
                setSelectedCourses([...e.target.selectedOptions].map((o) => o.value))
              }
              size={Math.min(courses.length, 6)}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {selectedStudent && enrolledCourses.length > 0 && (
                <p className="text-gray-500 text-xs mt-1">
                    (Courses already enrolled are not shown in this list.)
                </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Enroll
          </button>
        </div>
      </form>
    </div>
  );
}