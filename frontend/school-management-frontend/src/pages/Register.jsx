import { useState } from 'react';
import { registerUser } from '../services/authService';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', role: 'Student' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert('Registered successfully!');
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Registration failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <select name="role" onChange={handleChange}>
        <option value="Student">Student</option>
        <option value="Teacher">Teacher</option>
        <option value="Parent">Parent</option>
        <option value="Admin">Admin</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}
