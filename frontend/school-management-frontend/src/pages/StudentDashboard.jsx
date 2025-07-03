// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { authHeader } from "../services/AuthService";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5293/api/studentcourses/my-courses", {
          headers: authHeader()
        });
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <p className="text-gray-700 mb-6">
        Welcome! Here you can see your enrolled courses and assigned teachers.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">You are not enrolled in any courses yet.</p>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold">{course.title} ({course.code})</h2>
              <p className="text-sm text-gray-700 mt-1">
                Teacher: {course.teacherName}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
