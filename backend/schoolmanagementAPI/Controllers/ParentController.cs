using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SchoolManagementAPI.Controllers;

[Authorize(Roles = "Parent")]
[ApiController]
[Route("api/[controller]")]
public class ParentController : ControllerBase
{
    // View child profile
    [HttpGet("child-profile")]
    public IActionResult GetChildProfile()
    {
        // Logic to fetch child linked to logged-in parent
        return Ok("Child profile info");
    }

    // View grades
    [HttpGet("child-grades")]
    public IActionResult GetChildGrades()
    {
        return Ok("Child grades");
    }

    // View attendance
    [HttpGet("child-attendance")]
    public IActionResult GetChildAttendance()
    {
        return Ok("Child attendance record");
    }
}
