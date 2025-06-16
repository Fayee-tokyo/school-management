import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get('http://localhost:5293/api/admin/users-by-role/Teacher', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeachers(res.data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      alert('Could not load teachers');
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Teachers List</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td className="p-2 border">{teacher.firstName} {teacher.lastName}</td>
              <td className="p-2 border">{teacher.email}</td>
              <td className="p-2 border">{teacher.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
