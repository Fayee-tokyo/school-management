import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useEffect } from 'react';
import { authHeader } from '../services/AuthService';

export default function EditCourseForm({ courseId, onClose, onUpdated }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch existing course details on load
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5293/api/admin/courses/${courseId}`, {
          headers: authHeader()
        });
        reset({ title: res.data.title });
      } catch (error) {
        console.error('Failed to load course', error);
        alert("Could not load course details.");
        onClose();
      }
    };

    fetchCourse();
  }, [courseId, reset, onClose]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:5293/api/admin/courses/${courseId}`, data, {
        headers: authHeader()
      });
      alert("Course updated successfully!");
      onUpdated(); // refresh course list
      onClose();   // close modal
    } catch (error) {
      console.error("Error updating course", error);
      alert("Failed to update course.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block font-semibold">Course Title</label>
        <input
          type="text"
          {...register("title", { required: "Course title is required" })}
          className="w-full border rounded p-2"
        />
        {errors.title && <p className="text-red-600">{errors.title.message}</p>}
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
        <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
}
