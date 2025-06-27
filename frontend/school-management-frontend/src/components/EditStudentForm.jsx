import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect } from "react";
import { authHeader } from "../services/AuthService";

export default function EditStudentForm({ studentId, onClose, onUpdated }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:5293/api/admin/students/${studentId}`, {
          headers: authHeader()
        });
        reset(res.data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        alert("Failed to load student info");
      }
    };
    loadStudent();
  }, [studentId, reset]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:5293/api/admin/students/${studentId}`, data, {
        headers: authHeader(),
      });
      alert("Student updated successfully");
      onUpdated(); // refresh list
      onClose();   // close modal
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block font-medium">Full Name</label>
        <input
          type="text"
          {...register("fullName", { required: "Full name is required" })}
          className="w-full border p-2 rounded"
        />
        {errors.fullName && <p className="text-red-600">{errors.fullName.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Email</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="w-full border p-2 rounded"
        />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Gender</label>
        <select
          {...register("gender", { required: "Gender is required" })}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.gender && <p className="text-red-600">{errors.gender.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Faculty</label>
        <input
          type="text"
          {...register("faculty", { required: "Faculty is required" })}
          className="w-full border p-2 rounded"
        />
        {errors.faculty && <p className="text-red-600">{errors.faculty.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Class</label>
        <input
          type="text"
          {...register("class", { required: "Class is required" })}
          className="w-full border p-2 rounded"
        />
        {errors.class && <p className="text-red-600">{errors.class.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Date of Birth</label>
        <input
          type="date"
          {...register("dateOfBirth")}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Update
        </button>
        <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
}
