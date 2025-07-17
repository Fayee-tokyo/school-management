import { useState } from 'react';
import axios from 'axios';
import '../styles/ChangePassword.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmNewPassword } = formData;
    const email = localStorage.getItem('email'); // get email from localStorage

    if (!email) {
      setError('Email not found in localStorage.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5293/api/auth/change-password',
        {
          email,
          currentPassword,
          newPassword,
          confirmPassword: confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Password changed successfully! Redirecting...');
      setTimeout(() => {
        const role = localStorage.getItem('role');
        if (role === 'Admin') window.location.href = '/admin/';
        else if (role === 'Teacher') window.location.href = '/teacher/dashboard';
        else if (role === 'Student') window.location.href = '/student/dashboard';
        else if (role === 'Parent') window.location.href = '/parent/dashboard';
        else window.location.href = '/unauthorized';
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.errors?.Email?.[0] ||
        err.response?.data?.errors?.ConfirmPassword?.[0] ||
        err.response?.data?.message ||
        'Password change failed.'
      );
    }
  };

  return (
    <div className="change-password-container">
      <form onSubmit={handleSubmit}>
        <h2>Change Your Password</h2>
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={formData.currentPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmNewPassword"
          placeholder="Confirm New Password"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Change Password</button>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default ChangePassword;
