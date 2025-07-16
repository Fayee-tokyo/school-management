import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { authHeader } from "../services/AuthService";

export default function MarkGrade() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // 1) Load teacher's courses
  useEffect(() => {
    axios
      .get("http://localhost:5293/api/teacher/courses", { headers: authHeader() })
      .then(res => setCourses(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error("Error loading courses:", err));
  }, []);

  // 2) When course changes, load its students
  useEffect(() => {
    if (!selectedCourseId) {
      setStudents([]);
      return;
    }

    axios
      .get("http://localhost:5293/api/teacher/enrolled-students", { headers: authHeader() })
      .then(res => {
        const list = Array.isArray(res.data)
          ? res.data.filter(s => String(s.courseId) === String(selectedCourseId))
          : [];
        setStudents(list);
      })
      .catch(err => console.error("Error loading students:", err));
  }, [selectedCourseId]);

  // 3) Submit grade
  const onSubmit = data => {
    const payload = {
      courseId: parseInt(data.courseId),
      studentId: parseInt(data.studentId),
      score: parseInt(data.score)
    };

    axios
      .post("http://localhost:5293/api/teacher/grades", payload, { headers: authHeader() })
      .then(() => {
        alert("✅ Grade saved successfully!");
        reset();
      })
      .catch(err => {
        console.error("Submit error:", err.response?.data || err);
        alert("❌ Failed to save grade");
      });
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">✏️ Assign / Update Grade</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Course */}
        <div>
          <label className="block mb-1">Course</label>
          <select
            {...register("courseId", { required: "Course is required" })}
            onChange={e => setSelectedCourseId(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select course</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          {errors.courseId && (
            <p className="text-red-600 text-sm">{errors.courseId.message}</p>
          )}
        </div>

        {/* Student */}
        <div>
          <label className="block mb-1">Student</label>
          <select
            {...register("studentId", { required: "Student is required" })}
            className="w-full border p-2 rounded"
          >
            <option value="">Select student</option>
            {students.map(s => (
              <option key={s.studentId} value={s.studentId}>{s.studentName}</option>
            ))}
          </select>
          {errors.studentId && (
            <p className="text-red-600 text-sm">{errors.studentId.message}</p>
          )}
        </div>

        {/* Score */}
        <div>
          <label className="block mb-1">Score (0–100)</label>
          <input
            type="number"
            {...register("score", {
              required: "Score is required",
              min: { value: 0, message: "Min is 0" },
              max: { value: 100, message: "Max is 100" }
            })}
            className="w-full border p-2 rounded"
            placeholder="Enter score"
          />
          {errors.score && (
            <p className="text-red-600 text-sm">{errors.score.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Save Grade
        </button>
      </form>
    </div>
  );
}
