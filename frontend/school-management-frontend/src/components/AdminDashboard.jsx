// src/components/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('');
  const [newRole, setNewRole] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  const token = localStorage.getItem('token'); // JWT token from login

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:5293/api/admin/${filterRole ? `users-by-role/${filterRole}` : 'all-users'}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.response?.status === 401) {
        alert('Unauthorized. Please log in as an admin.');
      }
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5293/api/admin/delete-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error deleting user');
    }
  };

  const updateUserRole = async () => {
    if (!selectedUserId || !newRole) return alert('Select user and new role');
    try {
      await axios.post(
        `http://localhost:5293/api/admin/update-role?userId=${selectedUserId}&newRole=${newRole}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Role updated successfully');
      fetchUsers();
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Error updating role');
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRole]);

  return (
    <div className={styles.dashboard}>
      <h2>Admin Dashboard</h2>

      <div className={styles.controls}>
        <label>Filter by Role:</label>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="">All</option>
          <option value="Admin">Admin</option>
          <option value="Teacher">Teacher</option>
          <option value="Student">Student</option>
          <option value="Parent">Parent</option>
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>Roles</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.roles?.join(', ')}</td>
              <td>
                <button onClick={() => deleteUser(user.id)}>🗑 Delete</button>
                <button onClick={() => setSelectedUserId(user.id)}>🔧 Set Role</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUserId && (
        <div className={styles.roleUpdate}>
          <h4>Update Role</h4>
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="">Select new role</option>
            <option value="Admin">Admin</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
            <option value="Parent">Parent</option>
          </select>
          <button onClick={updateUserRole}>Update</button>
        </div>
      )}
    </div>
  );
}

