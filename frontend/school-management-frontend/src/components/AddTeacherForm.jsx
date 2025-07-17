import { useForm } from 'react-hook-form';
import axios from 'axios';
import { authHeader } from '../services/AuthService';


export default function AddTeacherForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:5293/api/admin/teachers', data, {
        headers: authHeader()
      });
      alert('✅ Teacher added successfully!');
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('❌ Error adding teacher:', err);
      alert('Failed to add teacher.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded shadow max-w-md mx-auto space-y-4"
    >
      <input
        type="text"
        placeholder="Full Name"
        {...register('fullName', { required: 'Full name is required' })}
        className="w-full border border-gray-300 p-2 rounded placeholder-gray-500"
      />
      {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}

      <input
        type="email"
        placeholder="Email"
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email format',
          }
        })}
        className="w-full border border-gray-300 p-2 rounded placeholder-gray-500"
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <input
        type="text"
        placeholder="Phone Number"
        {...register('phoneNumber', {
          pattern: {
            value: /^[0-9]{10,15}$/,
            message: 'Phone number must be 10-15 digits',
          }
        })}
        className="w-full border border-gray-300 p-2 rounded placeholder-gray-500"
      />
      {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}

      <select
        {...register('gender', { required: 'Gender is required' })}
        className="w-full border border-gray-300 p-2 rounded text-gray-500"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}

      <input
        type="text"
        placeholder="Faculty"
        {...register('faculty', { required: 'Faculty is required' })}
        className="w-full border border-gray-300 p-2 rounded placeholder-gray-500"
      />
      {errors.faculty && <p className="text-red-500 text-sm">{errors.faculty.message}</p>}

      <input
        type="text"
        placeholder="Department"
        {...register('department', { required: 'Department is required' })}
        className="w-full border border-gray-300 p-2 rounded placeholder-gray-500"
      />
      {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Add Teacher
      </button>
    </form>
  );
}
