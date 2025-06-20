namespace SchoolManagementAPI.DTOs.Course
{
    public class AssignCourseDto
    {
        public string TeacherId { get; set; } // ASP.NET Identity UserId
        public List<int> CourseIds { get; set; } = new List<int>();
    }
}
