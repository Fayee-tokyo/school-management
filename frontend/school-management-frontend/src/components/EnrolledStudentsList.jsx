import { useEffect, useState } from "react";
import axios from "axios";
import { authHeader } from "../services/AuthService";

export default function EnrolledStudentsList() {
  const [coursesWithStudents, setCoursesWithStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const res = await axios.get("http://localhost:5293/api/teacher/enrolled-students", {
          headers: authHeader(),
        });
        if (Array.isArray(res.data)) {
          setCoursesWithStudents(res.data);
        } else {
          setCoursesWithStudents([]);
        }
      } catch (err) {
        console.error("Error fetching enrolled students", err);
        setError("Failed to load enrolled students.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolled();
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Course Enrollments</h2>

      {coursesWithStudents.length === 0 ? (
        <p className="text-gray-500 italic">No enrolled courses found.</p>
      ) : (
        coursesWithStudents.map((course) => (
          <div key={course.courseId || course.id} className="mb-6 border rounded p-3 shadow">
            <h3 className="text-lg font-semibold text-blue-600">
              {course.courseTitle || course.title || "Untitled Course"}
            </h3>

            {!Array.isArray(course.students) || course.students.length === 0 ? (
              <p className="text-gray-500 italic">No students enrolled yet.</p>
            ) : (
              <ul className="list-disc ml-6 mt-2">
                {course.students.map((student, i) => (
                  <li key={student?.studentId || i}>
                    {student?.fullName || "Unknown"} ({student?.registrationNumber || "N/A"}) - {student?.email || "N/A"}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
}
