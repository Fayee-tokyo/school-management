import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function AddTeacherForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const token = localStorage.getItem('token');

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:5293/api/admin/add-teacher', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Teacher added successfully!');
      reset();
    } catch (err) {
      console.error('Error adding teacher:', err);
      alert('Failed to add teacher.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded shadow mt-4 max-w-md">
      <div className="mb-3">
        <label className="block font-medium">First Name</label>
        <input
          type="text"
          {...register('firstName', { required: 'First name is required' })}
          className="w-full border p-2 rounded"
        />
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
      </div>

      <div className="mb-3">
        <label className="block font-medium">Last Name</label>
        <input
          type="text"
          {...register('lastName', { required: 'Last name is required' })}
          className="w-full border p-2 rounded"
        />
        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
      </div>

      <div className="mb-3">
        <label className="block font-medium">Email</label>
        <input
          type="email"
          {...register('email', { required: 'Email is required' })}
          className="w-full border p-2 rounded"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="mb-3">
        <label className="block font-medium">Phone</label>
        <input
          type="text"
          {...register('phoneNumber')}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium">Staff ID</label>
        <input
          type="text"
          {...register('staffId', { required: 'Staff ID is required' })}
          className="w-full border p-2 rounded"
        />
        {errors.staffId && <p className="text-red-500 text-sm">{errors.staffId.message}</p>}
      </div>

      <div className="mb-3">
        <label className="block font-medium">Department</label>
        <input
          type="text"
          {...register('department')}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Teacher
      </button>
    </form>
  );
}
