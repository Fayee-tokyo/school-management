import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import './Login.module.css'; 

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5293/api/auth/login', formData);
      const { token } = response.data;

      if (!token) throw new Error('Token not found in response');

      // Store token
      localStorage.setItem('token', token);

      // Decode the JWT token
      const decoded = jwtDecode(token);
      console.log('Decoded JWT payload:', decoded);

      // Extract the role from standard claim or custom one
      let role = null;

      if (Array.isArray(decoded.role)) {
        role = decoded.role[0];
      } else if (decoded.role) {
        role = decoded.role;
      } else {
        const claimUri = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
        const claimVal = decoded[claimUri];
        role = Array.isArray(claimVal) ? claimVal[0] : claimVal;
      }

      if (!role) throw new Error('Role not found in token');

      // Store role
      localStorage.setItem('role', role);
      console.log('Extracted role:', role);

      // Redirect based on role
      switch (role) {
        case 'Admin':
          window.location.href = '/admin/';
          break;
        case 'Teacher':
          window.location.href = '/teacher/dashboard';
          break;
        case 'Student':
          window.location.href = '/student/dashboard';
          break;
        case 'Parent':
          window.location.href = '/parent/dashboard';
          break;
        default:
          window.location.href = '/unauthorized';
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

