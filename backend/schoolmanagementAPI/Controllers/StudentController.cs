using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data; // Ensure this namespace contains ApplicationDbContext
using SchoolManagementAPI.Models;
using System.Security.Claims;

namespace SchoolManagementAPI.Controllers;

[Authorize(Roles = "Student")]
[ApiController]
[Route("api/[controller]")]
public class StudentController : ControllerBase
{
    // Make sure ApplicationDbContext is defined in SchoolManagementAPI.Data namespace
    private readonly AppDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public StudentController(AppDbContext context, UserManager<IdentityUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // GET: api/student/profile
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);

        if (student == null)
            return NotFound("Student profile not found.");

        return Ok(student);
    }

    // GET: api/student/grades
    [HttpGet("grades")]
    public async Task<IActionResult> GetGrades()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var student = await _context.Students
            .Include(s => s.Grades)
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student == null)
            return NotFound("Student not found.");

        return Ok(student.Grades);
    }

    // GET: api/student/courses
    [HttpGet("courses")]
    public async Task<IActionResult> GetCourses()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var student = await _context.Students
            .Include(s => s.Courses)
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student == null)
            return NotFound("Student not found.");

        return Ok(student.Courses);
    }

    // Removed the private ApplicationDbContext class to resolve accessibility issues.
}
