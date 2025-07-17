import { useEffect, useState } from 'react';
import axios from 'axios';
import AddStudentForm from './AddStudentForm';
import EditStudentForm from './EditStudentForm';
import EnrollStudentForm from './EnrollStudentForm';
import { authHeader } from '../services/AuthService';
import styles from './AdminDashboard.module.css';

export default function AdminStudentDashboard() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null); 
  const [enrollingStudent, setEnrollingStudent] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true); 
      const res = await axios.get('http://localhost:5293/api/admin/students', {
        headers: authHeader(),
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to load students:', err);
      alert('Failed to fetch student list.'); 
    } finally {
      setLoading(false); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`http://localhost:5293/api/admin/students/${id}`, {
        headers: authHeader(),
      });
      fetchStudents();
    } catch (err) {
      console.error('Delete failed:', err); 
      alert('Failed to delete student.'); 
    }
  };
  const filteredStudents = students.filter((s) =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.wrapper}> 
      <h1 className={styles.title}>Student Management</h1> 

      <section className={styles.section}> 
        <h2 className={styles.heading}>Add Student</h2> 
        <AddStudentForm onSuccess={fetchStudents} />
      </section>

      <section className={styles.section}> 
        <h2 className={styles.heading}>Existing Students</h2> 

        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchBox} 
        />

        {loading ? (
          <div className={styles.message}>Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className={styles.message}>No students found.</div>
        ) : (
          <div className={styles.tableWrapper}> 
            <table className={styles.table}> 
              <thead className={styles.tableHead}> 
                <tr>
                  <th>Name</th>
                  <th>Reg No</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Faculty</th>
                  <th>Department</th>
                  <th>Class</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, i) => (
                  <tr key={s.id} className={i % 2 === 0 ? styles.tableRowAlt : ''}> 
                    <td>{s.fullName}</td>
                    <td>{s.registrationNumber}</td>
                    <td>{s.email}</td>
                    <td>{s.phoneNumber}</td>
                    <td>{s.faculty}</td>
                    <td>{s.department}</td>
                    <td>{s.class}</td>
                    <td className={styles.actions}> 
                      <button
                        className={styles.editBtn} 
                        onClick={() => setEditingStudent(s.id)} 
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.deleteBtn} 
                        onClick={() => handleDelete(s.id)}
                        title="Delete"
                      >
                        🗑
                      </button>
                      <button
                        className={styles.enrollBtn} 
                        onClick={() => setEnrollingStudent(s)} 
                        title="Enroll"
                      >
                        ➕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Edit Student Modal */}
      {editingStudent && (
        <EditStudentForm
          studentId={editingStudent} 
          onClose={() => setEditingStudent(null)}
          onUpdated={() => {
            setEditingStudent(null);
            fetchStudents();
          }}
        />
      )}

      {/* Enroll Student Modal */}
      {enrollingStudent && (
        <EnrollStudentForm
          student={enrollingStudent} 
          onClose={() => setEnrollingStudent(null)}
          onSuccess={() => {
            setEnrollingStudent(null);
            fetchStudents();
          }}
        />
      )}
    </div>
  );
}