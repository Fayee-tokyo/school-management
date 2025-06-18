import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function AddStudentForm() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = data => {
    const token = localStorage.getItem('token'); // Get token from localstorage
    
    axios.post('http://localhost:5293/api/admin/add-student', data, {
      headers: {
        Authorization: `Bearer ${token}` // Add token in header
      }
    })

      .then((response) => {
        console.log("Response;",response); //shows what came from backend
        alert(response.data.message ||"Student added!"); //shows backend message if exists
        reset();
      })
      .catch(err =>{
        console.error(err);
      alert("Error adding student.Please try again later.");

      if (err.response?.status === 401){
        alert ("Unauthorized! Please login again.");
      }
  });
};


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold">Add Student</h2>
      <input placeholder="Full Name" {...register("fullName")} className="border p-2 w-full" />
      <input placeholder="Registration Number" {...register("registrationNumber")} className="border p-2 w-full" />
      <input placeholder="Class" {...register("class")} className="border p-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Add</button>
    </form>
  );
}
