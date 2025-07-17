import { useState } from 'react';
import axios from 'axios';
import { authHeader } from '../services/AuthService';

export default function AddAdminForm({ onAdminAdded }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      await axios.post(
        'https://localhost:5293/api/superadmin/create-admin',
        { fullName, email },
        { headers: authHeader() }
      );

      setMessage('✅ Admin created successfully!');
      setFullName('');
      setEmail('');
      onAdminAdded(); // Refresh the list
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.title || '❌ Failed to create admin.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
      <h3 style={{ marginBottom: '1rem' }}>➕ Add New Admin</h3>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="fullName">Full Name</label><br />
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="Enter full name"
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="email">Email Address</label><br />
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter email"
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Creating...' : 'Create Admin'}
      </button>

      {message && (
        <p style={{ color: isError ? 'red' : 'green', marginTop: '1rem' }}>
          {message}
        </p>
      )}
    </form>
  );
}
