import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { authHeader } from "../services/AuthService";
import "../styles/MarkGrade.css"; // ✅ import your CSS module

export default function MarkGrade() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // Load teacher's courses
  useEffect(() => {
    axios
      .get("http://localhost:5293/api/teacher/courses", { headers: authHeader() })
      .then(res => setCourses(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error("Error loading courses:", err));
  }, []);

  // Load students for selected course
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

  // Submit grade
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
    <div className="grade-container">
      <h2 className="grade-heading">✏️ Assign or Update Student Grade</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grade-form">
        {/* Course Selection */}
        <div className="form-group">
          <label>Course</label>
          <select
            {...register("courseId", { required: "Course is required" })}
            onChange={e => setSelectedCourseId(e.target.value)}
            className="input-field"
          >
            <option value="">Select a course</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          {errors.courseId && <p className="error-text">{errors.courseId.message}</p>}
        </div>

        {/* Student Selection */}
        <div className="form-group">
          <label>Student</label>
          <select
            {...register("studentId", { required: "Student is required" })}
            className="input-field"
          >
            <option value="">Select a student</option>
            {students.map(s => (
              <option key={s.studentId} value={s.studentId}>{s.studentName}</option>
            ))}
          </select>
          {errors.studentId && <p className="error-text">{errors.studentId.message}</p>}
        </div>

        {/* Score Input */}
        <div className="form-group">
          <label>Score (0–100)</label>
          <input
            type="number"
            {...register("score", {
              required: "Score is required",
              min: { value: 0, message: "Min is 0" },
              max: { value: 100, message: "Max is 100" }
            })}
            className="input-field"
            placeholder="Enter grade score"
          />
          {errors.score && <p className="error-text">{errors.score.message}</p>}
        </div>

        {/* Submit */}
        <button type="submit" className="submit-btn">
          Save Grade
        </button>
      </form>
    </div>
  );
}
