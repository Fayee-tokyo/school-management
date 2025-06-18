
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
  
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    const { firstName, lastName, phone, email, password, confirmPassword } = form;

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!phone.trim()) newErrors.phone = 'Phone is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match';

    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email,
      password: form.password,
      role: form.role,
      
    };

    try {
      await axios.post('http://localhost:5293/api/auth/register', payload);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data) {
        const apiData = err.response.data;
        if (apiData.errors) {
          setErrors(apiData.errors);
        } else if (apiData.Message) {
          alert(`Error: ${apiData.Message}`);
        } else {
          alert('Registration failed.');
        }
      } else {
        console.error(err);
        alert('Network or server error.');
      }
    } finally {
      setSubmitting(false);
    }
  };

   return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.formBox}>
        <h2 className={styles.heading}>Create Account</h2>

        <div className={styles.rowGroup}>
          <div className={styles.formGroup}>
            <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className={errors.firstName ? styles.error : styles.inputField} />
            {errors.firstName && <p className={styles.errorText}>{errors.firstName}</p>}
          </div>

          <div className={styles.formGroup}>
            <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className={errors.lastName ? styles.error : styles.inputField} />
            {errors.lastName && <p className={styles.errorText}>{errors.lastName}</p>}
          </div>
        </div>

        <div className={styles.formGroup}>
          <input type="tel" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className={errors.phone ? styles.error : styles.inputField} />
          {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
        </div>

        <div className={styles.formGroup}>
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className={errors.email ? styles.error : styles.inputField} />
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
        </div>

        <div className={styles.rowGroup}>
          <div className={styles.formGroup}>
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className={errors.password ? styles.error : styles.inputField} />
            {errors.password && <p className={styles.errorText}>{errors.password}</p>}
          </div>

          <div className={styles.formGroup}>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? styles.error : styles.inputField} />
            {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword}</p>}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Account Type:</label>
          <select name="role" value={form.role} onChange={handleChange} className={styles.inputField}>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Parent">Parent</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        

        <button type="submit" className={styles.submitButton} disabled={submitting}>
          {submitting ? 'Creating Account...' : 'Register'}
        </button>

        <p className={styles.loginLink}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

