import { useEffect, useState } from "react";
import axios from "axios";
import { authHeader } from "../services/AuthService";

export default function EnrollStudentForm({ onSuccess }) {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const sRes = await axios.get("http://localhost:5293/api/admin/students-dropdown", {
        headers: authHeader()
      });
      const cRes = await axios.get("http://localhost:5293/api/admin/courses-dropdown", {
        headers: authHeader()
      });
      setStudents(sRes.data);
      setCourses(cRes.data);
    };

    fetchData();
  }, []);

  // ✅ Reusable function to fetch enrolled courses for selected student
  const refreshSelectedStudentEnrollments = async () => {
    if (!selectedStudent) {
      setEnrolledCourses([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5293/api/admin/enrollments`, {
        headers: authHeader()
      });

      const student = res.data.find(s => s.studentId === parseInt(selectedStudent));
      setEnrolledCourses(student ? student.courses : []);
    } catch (error) {
      console.error("Failed to refresh enrolled courses", error);
    }
  };

  // ✅ Automatically refresh when student selection changes
  useEffect(() => {
    refreshSelectedStudentEnrollments();
  }, [selectedStudent]);

  // ✅ Enroll student
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || selectedCourses.length === 0) {
      alert("Please select student and at least one course.");
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
      onSuccess?.();

      await refreshSelectedStudentEnrollments();
    } catch (err) {
      console.error("Enrollment failed", err);
      alert("Failed to enroll student.");
    }
  };

  // ✅ Unenroll student
  const handleUnenroll = async (courseId) => {
    if (!window.confirm("Are you sure you want to unenroll this student from the course?")) return;

    try {
      await axios.delete(`http://localhost:5293/api/admin/students/${selectedStudent}/unenroll/${courseId}`, {
        headers: authHeader()
      });

      alert("Unenrolled successfully!");
      await refreshSelectedStudentEnrollments();
    } catch (err) {
      console.error(err);
      alert("Failed to unenroll.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded mb-6">
      <h3 className="text-lg font-semibold mb-2">Enroll Student in Courses</h3>

      <label className="block mb-2">Select Student:</label>
      <select
        className="w-full p-2 border mb-4"
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
      >
        <option value="">-- Choose Student --</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.fullName}
          </option>
        ))}
      </select>

      {enrolledCourses.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Enrolled Courses:</h4>
          <ul className="list-disc ml-5">
            {enrolledCourses.map((course) => (
              <li key={course.courseId} className="flex justify-between items-center mb-1">
                <span>
                  {course.title} ({course.code}) — 
                  <span className="italic text-sm text-gray-700 ml-1">
                    Teacher: {course.teacherName}
                  </span>
                </span>
                <button
                  onClick={() => handleUnenroll(course.courseId)}
                  className="text-red-600 hover:underline text-sm ml-4"
                  type="button"
                >
                  Unenroll
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <label className="block mb-2">Select Courses to Enroll:</label>
      <select
        className="w-full p-2 border mb-4"
        multiple
        value={selectedCourses}
        onChange={(e) =>
          setSelectedCourses([...e.target.selectedOptions].map((o) => o.value))
        }
      >
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Enroll
      </button>
    </form>
  );
}
