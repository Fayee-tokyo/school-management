import { useEffect, useState } from 'react';
import axios from 'axios';
import { authHeader } from '../services/AuthService';
import AddTeacherForm from './AddTeacherForm';
import EditTeacherForm from './EditTeacherForm';
import AssignCoursesForm from './AssignCoursesForm';
import AdminCourseDashboard from './AdminCourseDashboard';
import AdminStudentDashboard from './AdminStudentDashboard';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('teachers');
  const [teachers, setTeachers] = useState([]);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5293/api/admin/teachers', {
        headers: authHeader(),
      });
      setTeachers(res.data);
    } catch (err) {
      console.error('Failed to load teachers:', err);
      alert('Failed to fetch teacher list.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    try {
      await axios.delete(`http://localhost:5293/api/admin/teachers/${id}`, {
        headers: authHeader(),
      });
      fetchTeachers();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete teacher.');
    }
  };

  const filteredTeachers = teachers.filter((t) =>
    t.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.wrapper}>
      {/* Tab Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'teachers' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('teachers')}
        >
          👩‍🏫 Teacher Management
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'courses' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('courses')}
        >
          📚 Course Management
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'students' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('students')}
        >
          🎓 Student Management
        </button>
      </div>

      {/* === Teacher Management Section === */}
      {activeTab === 'teachers' && (
        <>
          <h1 className={styles.title}>Teacher Management</h1>

          <section className={styles.section}>
            <h2 className={styles.heading}>Add Teacher</h2>
            <AddTeacherForm onSuccess={fetchTeachers} />

            <button
              onClick={() => setShowAssignForm(true)}
              className={styles.assignBtn}
            >
              ➕ Assign Courses to Teacher
            </button>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Existing Teachers</h2>

            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchBox}
            />

            {loading ? (
              <div className={styles.message}>Loading teachers...</div>
            ) : filteredTeachers.length === 0 ? (
              <div className={styles.message}>No teachers found.</div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Gender</th>
                      <th>Faculty</th>
                      <th>Department</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map((t, i) => (
                      <tr key={t.id} className={i % 2 === 0 ? styles.tableRowAlt : ''}>
                        <td>{t.fullName}</td>
                        <td>{t.email}</td>
                        <td>{t.phoneNumber}</td>
                        <td>{t.gender}</td>
                        <td>{t.faculty}</td>
                        <td>{t.department}</td>
                        <td className={styles.actions}>
                          <button
                            onClick={() => setEditingTeacher(t)}
                            className={styles.editBtn}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className={styles.deleteBtn}
                            title="Delete"
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Edit Form Modal */}
          {editingTeacher && (
            <EditTeacherForm
              teacher={editingTeacher}
              onClose={() => setEditingTeacher(null)}
              onSuccess={() => {
                setEditingTeacher(null);
                fetchTeachers();
              }}
            />
          )}

          {/* Assign Courses Modal */}
          {showAssignForm && (
            <AssignCoursesForm
              onClose={() => setShowAssignForm(false)}
              onSuccess={() => {
                setShowAssignForm(false);
                fetchTeachers();
              }}
            />
          )}
        </>
      )}

      {/* === Course Management Section === */}
      {activeTab === 'courses' && <AdminCourseDashboard />}

      {/* === Student Management Section === */}
      {activeTab === 'students' && <AdminStudentDashboard />}
    </div>
  );
}
