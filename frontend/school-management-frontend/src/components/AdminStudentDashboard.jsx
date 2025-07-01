import { useEffect, useState } from "react";
import axios from "axios";
import AddStudentForm from "./AddStudentForm";
import EditStudentForm from "./EditStudentForm";
import EnrollStudentForm from "./EnrollStudentForm";
import { authHeader } from "../services/AuthService";

export default function AdminStudentDashboard() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [enrollingId, setEnrollingId] = useState(null); // NEW

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5293/api/admin/students", {
        headers: authHeader(),
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`http://localhost:5293/api/admin/students/${id}`, {
        headers: authHeader(),
      });
      fetchStudents();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Student Management</h2>

      <AddStudentForm onSuccess={fetchStudents} />

      <h3 className="mt-6 text-lg font-semibold mb-2">All Students</h3>
      <ul className="space-y-2">
        {students.map((student) => (
          <li key={student.id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <p><strong>{student.fullName}</strong></p>
              <p>Reg No: {student.registrationNumber}</p>
              <p>Email: {student.email}</p>
              <p>Phone: {student.phoneNumber}</p>
              <p>Faculty: {student.faculty}</p>
              <p>Department: {student.department}</p>
              <p>Class: {student.class}</p>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => setEditingId(student.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(student.id)}
              >
                Delete
              </button>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => setEnrollingId(student.id)}
              >
                Enroll
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
            <EditStudentForm
              studentId={editingId}
              onClose={() => setEditingId(null)}
              onUpdated={fetchStudents}
            />
          </div>
        </div>
      )}

      {enrollingId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
            <EnrollStudentForm
              studentId={enrollingId}
              onClose={() => setEnrollingId(null)}
              onSuccess={() => {
                fetchStudents();
                setEnrollingId(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
