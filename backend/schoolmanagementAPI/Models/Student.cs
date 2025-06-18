using System.ComponentModel.DataAnnotations;
using SchoolManagementAPI.Models;

public class Student
{
    public int? Id { get; set; }
    [Required]
    public string FullName { get; set; }
    [Required]
    public string RegistrationNumber { get; set; }
    [Required]
    public string Class { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? UserId { get; set; }
    public ICollection<Courses> Courses { get; set; } = new List<Courses>();
    public ICollection<Grade> Grades { get; set; } = new List<Grade>();
    public ICollection<StudentCourse> StudentCourses { get; set; }
}
