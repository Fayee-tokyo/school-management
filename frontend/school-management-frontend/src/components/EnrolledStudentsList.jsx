import { useEffect, useState } from "react";
import axios from "axios";
import { authHeader } from "../services/AuthService";

export default function EnrolledStudentsList() {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const res = await axios.get("http://localhost:5293/api/teacher/enrolled-students", {
          headers: authHeader(),
        });

        if (Array.isArray(res.data)) {
          // Group students by course
          const grouped = {};
          res.data.forEach((entry) => {
            const courseKey = `${entry.courseId}-${entry.courseTitle}`;
            if (!grouped[courseKey]) {
              grouped[courseKey] = [];
            }
            grouped[courseKey].push(entry);
          });

          setGroupedData(grouped);
        } else {
          console.error("Unexpected response:", res.data);
          setGroupedData({});
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
      <h2 className="text-xl font-bold mb-4">📘 Enrolled Students by Course</h2>

      {Object.keys(groupedData).length === 0 ? (
        <p className="text-gray-500 italic">No enrolled students found.</p>
      ) : (
        Object.entries(groupedData).map(([courseKey, students]) => {
          const courseTitle = courseKey.split("-")[1];
          return (
            <div key={courseKey} className="mb-6 border rounded p-4 shadow">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                📘 {courseTitle}
              </h3>
              <ul className="list-disc ml-6">
                {students.map((student) => (
                  <li key={student.studentId}>
                    {student.studentName || "Unnamed Student"} (ID: {student.studentId})
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
}
