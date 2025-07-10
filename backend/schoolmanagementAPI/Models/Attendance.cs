using System;

namespace SchoolManagementAPI.Models
{
    public class Attendance
    {
        public int Id { get; set; }

        public int StudentId { get; set; }
        public Student Student { get; set; }

        public int CourseId { get; set; }
        public Courses Course { get; set; }

        public int WeekNumber { get; set; }

        public bool IsPresent { get; set; }

        public DateTime DateMarked { get; set; }

        public string MarkedByTeacherId { get; set; }
    }
}
