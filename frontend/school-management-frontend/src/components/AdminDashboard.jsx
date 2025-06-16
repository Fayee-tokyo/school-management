// src/components/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import StudentList from './StudentList';
import TeacherList from './TeacherList';
import AddStudentForm from './AddStudentForm';
import AddTeacherForm from './AddTeacherForm';

export default function AdminDashboard() {
  const [userRole, setUserRole] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  // User Management
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('');
  const [newRole, setNewRole] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    setUserRole(role);
    if (role === 'Admin') fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRole]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5293/api/admin/${filterRole ? `users-by-role/${filterRole}` : 'all-users'}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5293/api/admin/delete-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error deleting user');
    }
  };

  const updateUserRole = async () => {
    if (!selectedUserId || !newRole) return alert('Select user and role');
    try {
      await axios.post(
        `http://localhost:5293/api/admin/update-role?userId=${selectedUserId}&newRole=${newRole}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Role updated');
      fetchUsers();
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Error updating role');
    }
  };

  if (userRole !== 'Admin') {
    return (
      <div className="p-6 text-center text-red-600 font-bold">
        Unauthorized. Only Admins can access this page.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded ${activeTab === 'students' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
        >
          Students
        </button>
        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2 rounded ${activeTab === 'teachers' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
        >
          Teachers
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <div>
          <div className="mb-4">
            <label className="mr-2 font-medium">Filter by Role:</label>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="border p-1">
              <option value="">All</option>
              <option value="Admin">Admin</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
              <option value="Parent">Parent</option>
            </select>
          </div>

          <table className="w-full border mb-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Roles</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="text-center">
                  <td className="border p-1">{user.firstName} {user.lastName}</td>
                  <td className="border p-1">{user.email}</td>
                  <td className="border p-1">{user.phoneNumber}</td>
                  <td className="border p-1">{user.roles?.join(', ')}</td>
                  <td className="border p-1">
                    <button onClick={() => deleteUser(user.id)} className="mr-2 text-red-600">🗑</button>
                    <button onClick={() => setSelectedUserId(user.id)} className="text-blue-600">🔧</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedUserId && (
            <div className="mt-4">
              <label className="mr-2 font-semibold">New Role:</label>
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="border p-1 mr-2">
                <option value="">Select</option>
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
                <option value="Parent">Parent</option>
              </select>
              <button onClick={updateUserRole} className="bg-blue-600 text-white px-3 py-1 rounded">
                Update Role
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'students' && (
        <>
          <StudentList />
          <h2 className="text-xl font-semibold mt-6">Add New Student</h2>
          <AddStudentForm />
        </>
      )}

      {activeTab === 'teachers' && (
        <>
          <TeacherList />
          <h2 className="text-xl font-semibold mt-6">Add New Teacher</h2>
          <AddTeacherForm />
        </>
      )}
    </div>
  );
}


