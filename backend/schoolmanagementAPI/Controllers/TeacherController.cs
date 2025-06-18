using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Models;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SchoolManagementAPI.Controllers
{
    [Authorize(Roles = "Teacher")]
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TeacherController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/teacher/students
        [HttpGet("students")]
        public async Task<IActionResult> GetStudents()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID not found in token.");

            var students = await _context.Courses
                .Where(c => c.TeacherId == userId)
                .Include(c => c.Students)
                .SelectMany(c => c.Students)
                .Distinct()
                .ToListAsync();

            return Ok(students);
        }

        // POST: api/teacher/grade
        [HttpPost("grades")]
        public async Task<IActionResult> AssignGrade([FromBody] Grade model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var isStudentInCourse = await _context.Courses
                .AnyAsync(c => c.TeacherId == userId && c.Students.Any(s => s.Id == model.StudentId));

            if (!isStudentInCourse)
                return Unauthorized("This student is not in your course.");

            model.TeacherId = userId;
            _context.Grades.Add(model);
            await _context.SaveChangesAsync();

            return Ok("Grade assigned.");
        }

        // POST: api/teacher/attendance
        [HttpPost("attendance")]
        public async Task<IActionResult> MarkAttendance([FromBody] Attendance model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var isStudentInCourse = await _context.Courses
                .AnyAsync(c => c.TeacherId == userId && c.Students.Any(s => s.Id == model.StudentId));

            if (!isStudentInCourse)
                return Unauthorized("You can only mark attendance for your students.");

            model.Date = model.Date.Date;
            model.TeacherId = userId;
            _context.Attendances.Add(model);
            await _context.SaveChangesAsync();

            return Ok("Attendance marked.");
        }
    }
}


