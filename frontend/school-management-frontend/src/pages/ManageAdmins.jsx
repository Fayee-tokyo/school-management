import { useEffect, useState } from 'react';
import axios from 'axios';
import AddAdminForm from '../components/AddAdminForm';
import { authHeader } from '../services/AuthService';

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://localhost:5293/api/superadmin/get-admins',
        { headers: authHeader() }
      );
      setAdmins(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch admins:', err);
      setError('Failed to load admins. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>👥 Manage Admins</h2>

      <button onClick={() => setShowAddForm(!showAddForm)} style={{ marginBottom: '1rem' }}>
        {showAddForm ? 'Cancel' : '➕ Add Admin'}
      </button>

      {showAddForm && (
        <div style={{ marginBottom: '2rem' }}>
          <AddAdminForm
            onAdminAdded={() => {
              fetchAdmins();
              setShowAddForm(false);
            }}
          />
        </div>
      )}

      <h3>📋 Existing Admins</h3>

      {loading ? (
        <p>Loading admins...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : admins.length === 0 ? (
        <p>No admins found.</p>
      ) : (
        <ul>
          {admins.map((admin) => (
            <li key={admin.id}>
              <strong>{admin.fullName}</strong> — {admin.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
