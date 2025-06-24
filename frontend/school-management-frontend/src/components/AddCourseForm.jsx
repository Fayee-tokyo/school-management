import { useForm } from 'react-hook-form';
import axios from 'axios';
import { authHeader } from '../services/AuthService';

export default function AddCourseForm({ onSuccess }) {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:5293/api/admin/courses', data, {
        headers: authHeader(),
      });
      alert('Course added!');
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error adding course:', err);
      alert('Failed to add course');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-2">Add Course</h2>
      <input
        {...register('title', { required: true })}
        placeholder="Course Title"
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
        Add Course
      </button>
    </form>
  );
}
