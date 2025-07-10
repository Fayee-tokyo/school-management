import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { authHeader } from "../services/AuthService";

export default function MarkAttendance() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [weekNumber, setWeekNumber] = useState("");
  const [attendanceData, setAttendanceData] = useState({});
  const { handleSubmit } = useForm();

  // 🔁 Load courses assigned to the teacher
  useEffect(() => {
    axios
      .get("http://localhost:5293/api/teacher/courses", { headers: authHeader() })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else {
          console.error("Expected courses array, got:", res.data);
          setCourses([]);
        }
      })
      .catch((err) => {
        console.error("Error loading courses:", err);
        setCourses([]);
      });
  }, []);

  // 🔁 Load students enrolled in selected course
  useEffect(() => {
    if (!selectedCourseId) return;

    axios
      .get("http://localhost:5293/api/teacher/enrolled-students", { headers: authHeader() })
      .then((res) => {
        const filtered = res.data.filter(
          (s) => String(s.courseId) === String(selectedCourseId)
        );

        setStudents(filtered);

        const defaultAttendance = {};
        filtered.forEach((s) => {
          defaultAttendance[s.studentId] = true;
        });

        setAttendanceData(defaultAttendance);
      })
      .catch((err) => {
        console.error("Error loading students:", err);
        setStudents([]);
      });
  }, [selectedCourseId]);

  // ✅ Toggle present/absent
  const handleToggle = (studentId) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  // ✅ Submit attendance
  const onSubmit = () => {
    if (!selectedCourseId || !weekNumber) {
      alert("Please select both a course and a week.");
      return;
    }

    const records = students.map((student) => ({
      studentId: Number(student.studentId),
      isPresent: attendanceData[student.studentId] ?? true,
    }));

    const payload = {
      courseId: parseInt(selectedCourseId),
      weekNumber: parseInt(weekNumber),
      records,
    };

    console.log("📤 Submitting payload:", payload);
     console.log("📤 Final Payload:", JSON.stringify(payload, null, 2));

    axios
      .post("http://localhost:5293/api/teacher/mark-attendance", payload, {
        headers: authHeader(),
      })
      .then(() => alert("✅ Attendance submitted successfully"))
      .catch((err) => {
        console.error("❌ Submit error:", err.response?.data || err);
        alert("❌ Failed to submit attendance");
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">📅 Mark Attendance</h2>

      {/* 📘 Course Selector */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Course</label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select course</option>
          {Array.isArray(courses) &&
            courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
        </select>
      </div>

      {/* 📅 Week Selector */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Week</label>
        <select
          value={weekNumber}
          onChange={(e) => setWeekNumber(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select week</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Week {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Attendance Table */}
      {students.length > 0 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="w-full table-auto border mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border text-left">Student Name</th>
                <th className="p-2 border text-center">Present</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.studentId}>
                  <td className="p-2 border">{student.studentName}</td>
                  <td className="p-2 border text-center">
                    <input
                      type="checkbox"
                      checked={attendanceData[student.studentId] ?? true}
                      onChange={() => handleToggle(student.studentId)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="submit"
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Attendance
          </button>
        </form>
      )}
    </div>
  );
}
