using Microsoft.AspNetCore.Identity;
using SchoolManagementAPI.Models;

public class Teacher
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string StaffId { get; set; }
    public string Subject { get; set; }
    public string? Email { get; set; }
    public ICollection<Courses> Courses { get; set; }

}
