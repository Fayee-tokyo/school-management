import { useForm } from "react-hook-form";
import axios from "axios";
import { authHeader } from "../services/AuthService";

export default function AddStudentForm({ onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5293/api/admin/students", data, {
        headers: authHeader(),
      });
      alert("Student added successfully");
      reset();
      onSuccess(); // refresh list
    } catch (err) {
      console.error("Error adding student", err);
      alert("Failed to add student");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-100 p-4 rounded">
      <h3 className="text-lg font-semibold mb-2">Add New Student</h3>

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
  <label className="block font-semibold">Registration Number</label>
  <input
    type="text"
    {...register("registrationNumber", {
      required: "Registration number is required",
      minLength: { value: 4, message: "Minimum 4 characters" }
    })}
    className="w-full border p-2 rounded"
  />
  {errors.registrationNumber && <p className="text-red-600">{errors.registrationNumber.message}</p>}
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
  <label className="block font-semibold">Phone Number</label>
  <input
    type="tel"
    {...register("phoneNumber", {
      required: "Phone number is required",
      pattern: {
        value: /^[0-9]{10,15}$/,
        message: "Enter a valid phone number"
      }
    })}
    className="w-full border p-2 rounded"
  />
  {errors.phoneNumber && <p className="text-red-600">{errors.phoneNumber.message}</p>}
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
  <label className="block font-semibold">Department</label>
  <input
    type="text"
    {...register("department", { required: "Department is required" })}
    className="w-full border p-2 rounded"
  />
  {errors.department && <p className="text-red-600">{errors.department.message}</p>}
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

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Student
      </button>
    </form>
  );
}
