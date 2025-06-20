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
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded shadow mt-4 max-w-md">
      {/* Full Name */}
      <div className="mb-3">
        <label className="block font-medium">Full Name</label>
        <input
          type="text"
          {...register('fullName', { required: 'Full name is required' })}
          className="w-full border p-2 rounded"
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div className="mb-3">
        <label className="block font-medium">Email</label>
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format',
            }
          })}
          className="w-full border p-2 rounded"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* Phone Number */}
      <div className="mb-3">
        <label className="block font-medium">Phone Number</label>
        <input
          type="text"
          {...register('phoneNumber', {
            pattern: {
              value: /^[0-9]{10,15}$/,
              message: 'Phone number must be 10-15 digits',
            }
          })}
          className="w-full border p-2 rounded"
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
      </div>

      {/* Gender */}
      <div className="mb-3">
        <label className="block font-medium">Gender</label>
        <select
          {...register('gender', { required: 'Gender is required' })}
          className="w-full border p-2 rounded"
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
      </div>

      {/* Faculty */}
      <div className="mb-3">
        <label className="block font-medium">Faculty</label>
        <input
          type="text"
          {...register('faculty', { required: 'Faculty is required' })}
          className="w-full border p-2 rounded"
        />
        {errors.faculty && <p className="text-red-500 text-sm">{errors.faculty.message}</p>}
      </div>

      {/* Department */}
      <div className="mb-3">
        <label className="block font-medium">Department</label>
        <input
          type="text"
          {...register('department', { required: 'Department is required' })}
          className="w-full border p-2 rounded"
        />
        {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Add Teacher
      </button>
    </form>
  );
}
