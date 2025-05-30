import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css'; // Make sure the CSS module exists

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      const formData = { ...form };
        delete formData.confirmPassword;


      const response = await fetch('https://your-api-url.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      alert('Registered successfully!');
      navigate('/login');
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2>Register</h2>

      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
        className={styles.inputField}
      />
      {errors.firstName && <p className={styles.errorText}>{errors.firstName}</p>}

      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
        className={styles.inputField}
      />
      {errors.lastName && <p className={styles.errorText}>{errors.lastName}</p>}

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        className={styles.inputField}
      />
      {errors.username && <p className={styles.errorText}>{errors.username}</p>}

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        className={styles.inputField}
      />
      {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className={styles.inputField}
      />
      {errors.email && <p className={styles.errorText}>{errors.email}</p>}

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className={styles.inputField}
      />
      {errors.password && <p className={styles.errorText}>{errors.password}</p>}

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleChange}
        className={styles.inputField}
      />
      {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword}</p>}

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className={styles.selectField}
      >
        <option value="Student">Student</option>
        <option value="Teacher">Teacher</option>
        <option value="Parent">Parent</option>
        <option value="Admin">Admin</option>
      </select>

      <button type="submit" className={styles.submitButton} disabled={submitting}>
        {submitting ? 'Registering...' : 'Register'}
      </button>

      <p className={styles.loginLink}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  );
}
