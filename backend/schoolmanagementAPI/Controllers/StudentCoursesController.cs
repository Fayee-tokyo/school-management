using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Models;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SchoolManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentCoursesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentCoursesController(AppDbContext context)
        {
            _context = context;
        }

        //  GET: api/studentcourses
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.StudentCourses
                .Include(sc => sc.Student)
                .Include(sc => sc.Course)
                .ToListAsync();

            return Ok(data);
        }

        //  POST: api/studentcourses
        [HttpPost]
        public async Task<IActionResult> EnrollStudent([FromBody] StudentCourse model)
        {
            var alreadyExists = await _context.StudentCourses
                .AnyAsync(sc => sc.StudentId == model.StudentId && sc.CourseId == model.CourseId);

            if (alreadyExists)
                return BadRequest("Student is already enrolled in this course.");

            _context.StudentCourses.Add(model);
            await _context.SaveChangesAsync();

            return Ok("Student enrolled successfully.");
        }

        //  GET: api/studentcourses/my-courses (for logged-in students)
        [Authorize(Roles = "Student")]
        [HttpGet("my-courses")]
        public async Task<IActionResult> GetMyCourses()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (student == null)
                return NotFound("Student not found.");

            var courses = await _context.StudentCourses
                .Where(sc => sc.StudentId == student.Id)
                .Include(sc => sc.Course)
                    .ThenInclude(c => c.Teacher) //Include teacher details
                .Select(sc => new
                {
                    sc.Course.Id,
                    sc.Course.Title,
                    TeacherName = sc.Course.Teacher != null ? sc.Course.Teacher.FullName : "Unassigned"
                })
                .ToListAsync();

            return Ok(courses);
        }
    }
}
