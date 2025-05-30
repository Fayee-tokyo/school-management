using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SchoolManagementAPI.Controllers;

[Authorize(Roles = "Student")]
[ApiController]
[Route("api/[controller]")]
public class StudentController : ControllerBase
{
    // View own profile
    [HttpGet("profile")]
    public IActionResult GetProfile()
    {
        // Logic to return student info based on User.Identity.Name
        return Ok("Student profile info");
    }

    // View grades
    [HttpGet("grades")]
    public IActionResult GetGrades()
    {
        // Logic to return grades
        return Ok("Student grades");
    }

    // View courses
    [HttpGet("courses")]
    public IActionResult GetCourses()
    {
        return Ok("Enrolled courses");
    }
}
