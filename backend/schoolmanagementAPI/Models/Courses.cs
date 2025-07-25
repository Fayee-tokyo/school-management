using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace SchoolManagementAPI.Models
{
    public class Courses
    {
        public int Id { get; set; }
        public string Title { get; set; }

        // Many-to-Many with Students
        public ICollection<Student> Students { get; set; }
        public ICollection<StudentCourse> StudentCourses { get; set; }
        public string? TeacherId { get; set; }
        public Teacher? Teacher { get; set; }

        public ICollection<TeacherCourse> TeacherCourses { get; set; }
        public ICollection<Grade> Grades { get; set; } = new List<Grade>();
        public ICollection<Attendance> Attendances { get; set; }
    }
}
