using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SchoolManagementAPI.Controllers;

[Authorize(Roles = "Teacher")]
[ApiController]
[Route("api/[controller]")]
public class TeacherController : ControllerBase
{
    // View students assigned to teacher's course
    [HttpGet("students")]
    public IActionResult GetStudents()
    {
        // Logic to fetch students assigned to teacher's courses
        return Ok("List of students for teacher");
    }

    // Record attendance
    [HttpPost("attendance")]
    public IActionResult MarkAttendance()
    {
        // Logic to mark attendance
        return Ok("Attendance marked.");
    }

    // Assign or update grades
    [HttpPost("grade")]
    public IActionResult AssignGrade()
    {
        // Logic to assign grade
        return Ok("Grade assigned.");
    }
}
