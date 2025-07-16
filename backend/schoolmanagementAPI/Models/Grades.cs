
using SchoolManagementAPI.Models;

public class Grade
{
    public int Id { get; set; }

    public int StudentId { get; set; }      // assuming Identity string ID
    public Student Student { get; set; }

    public int CourseId { get; set; }
    public Courses Course { get; set; }

    public string TeacherId { get; set; }      // Identity user
    public ApplicationUser Teacher { get; set; }

    public int Score { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
