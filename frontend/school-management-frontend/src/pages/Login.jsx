import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import './Login.module.css'; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5293/api/auth/login', formData);
      const { token, isFirstLogin } = response.data;

      if (!token) throw new Error('Token not found in response');

      // Store token
      localStorage.setItem('token', token);
      localStorage.setItem('email', formData.email); // needed for password change

      // Decode token to get roles
      const decoded = jwtDecode(token);
      let roles = [];

      if (Array.isArray(decoded.role)) {
        roles = decoded.role;
      } else if (decoded.role) {
        roles = [decoded.role];
      } else {
        const claimUri = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
        const claimVal = decoded[claimUri];
        roles = Array.isArray(claimVal) ? claimVal : [claimVal];
      }

      if (roles.length === 0) throw new Error('No roles found in token');

      // Store roles
      localStorage.setItem('roles', JSON.stringify(roles));
      localStorage.setItem('role', roles[0]); // for quick access

      // Redirect based on first login
      if (isFirstLogin) {
        navigate('/change-password');
      } else {
        // Redirect based on role priority
        if (roles.includes('SuperAdmin')) {
          navigate('/superadmin/dashboard');
        } else if (roles.includes('Admin')) {
          window.location.href = '/admin/';
        } else if (roles.includes('Teacher')) {
          window.location.href = '/teacher/dashboard';
        } else if (roles.includes('Student')) {
          window.location.href = '/student/dashboard';
        } else if (roles.includes('Parent')) {
          window.location.href = '/parent/dashboard';
        } else {
          window.location.href = '/unauthorized';
        }
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
