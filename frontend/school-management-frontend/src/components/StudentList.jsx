import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StudentList({ isAdmin }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5293/api/admin/students')
      .then(res => setStudents(res.data))
      .catch(err => console.error('Error fetching students:', err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Students</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th>
            <th>Name</th>
            <th>Reg Number</th>
            <th>Class</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id} className="border-t">
              <td>{student.id}</td>
              <td>{student.fullName}</td>
              <td>{student.registrationNumber}</td>
              <td>{student.class}</td>
              {isAdmin && (
                <td>
                  <button>Edit</button> <button>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
