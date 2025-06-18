using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Models;

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

        // ✅ GET: api/studentcourses
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.StudentCourses
                .Include(sc => sc.Student)
                .Include(sc => sc.Course)
                .ToListAsync();

            return Ok(data);
        }

        // ✅ POST: api/studentcourses
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
    }
}
