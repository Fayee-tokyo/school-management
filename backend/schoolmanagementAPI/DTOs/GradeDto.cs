using System.ComponentModel.DataAnnotations;

public class GradeDTO
{
    public int CourseId { get; set; }
    public int StudentId { get; set; }
    
    [Range(0, 100, ErrorMessage = "Grade must be between 0 and 100")]
    public int Score { get; set; }
}
