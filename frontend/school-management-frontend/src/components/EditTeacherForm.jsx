import React from 'react';
import { useForm } from 'react-hook-form';
import { updateTeacher } from '../services/TeacherService';

export default function EditTeacherForm({ teacher, onSuccess, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: teacher.fullName,
      email: teacher.email,
      phoneNumber: teacher.phoneNumber,
      gender: teacher.gender,
      faculty: teacher.faculty,
      department: teacher.department,
      userId: teacher.userId,
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateTeacher(teacher.id, data);
      alert('✅ Teacher updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      if (error.response) {
        console.error('❌ Backend error response:', error.response.data);
        alert(JSON.stringify(error.response.data.errors || error.response.data));
      } else {
        console.error('❌ Unknown error:', error);
        alert('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Teacher</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Hidden userId field (required for backend) */}
          <input type="hidden" {...register('userId')} />

          {/* Full Name */}
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              {...register('fullName', { required: 'Full name is required' })}
              className="w-full border p-2 rounded"
              placeholder="Full Name"
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format',
                },
              })}
              className="w-full border p-2 rounded"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium">Phone Number</label>
            <input
              type="text"
              {...register('phoneNumber', {
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: 'Phone number must be 10-15 digits',
                },
              })}
              className="w-full border p-2 rounded"
              placeholder="Phone Number"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
          </div>

          {/* Gender */}
          <div>
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
          <div>
            <label className="block font-medium">Faculty</label>
            <input
              {...register('faculty', { required: 'Faculty is required' })}
              className="w-full border p-2 rounded"
              placeholder="Faculty"
            />
            {errors.faculty && <p className="text-red-500 text-sm">{errors.faculty.message}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block font-medium">Department</label>
            <input
              {...register('department', { required: 'Department is required' })}
              className="w-full border p-2 rounded"
              placeholder="Department"
            />
            {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
