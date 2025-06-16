using SchoolManagementAPI.Models;

public class Student
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string RegistrationNumber { get; set; }
    public string? Class { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? UserId { get; set; }
    public ICollection<Courses> Courses { get; set; }
    public ICollection<Grade> Grades { get; set; }
}
