using SchoolManagementAPI.Models;

public class TeacherCourse
{
    public int TeacherId { get; set; }
    public Teacher Teacher { get; set; }

    public int CourseId { get; set; }
    public Courses Course { get; set; }
}
