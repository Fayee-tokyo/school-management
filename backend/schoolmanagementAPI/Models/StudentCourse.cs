namespace SchoolManagementAPI.Models
{
    public class StudentCourse
    {
        public int StudentId { get; set; }
        public Student Student { get; set; }

        public int CourseId { get; set; }
        public Courses Course { get; set; }
    }
}
