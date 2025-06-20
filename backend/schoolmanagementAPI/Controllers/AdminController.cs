using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.DTOs.Course;
using SchoolManagementAPI.DTOs.Teacher;
using SchoolManagementAPI.Models;
using System.Security.Claims;

namespace SchoolManagementAPI.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // ✅ DEBUG ENDPOINT - GET: api/admin/debug/claims
        [HttpGet("debug/claims")]
        public IActionResult DebugToken()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            var claims = identity?.Claims.Select(c => new { c.Type, c.Value }).ToList();

            return Ok(new
            {
                IsAuthenticated = identity?.IsAuthenticated,
                Name = identity?.Name,
                Claims = claims
            });
        }

        // ✅ GET: api/admin/teachers
        [HttpGet("teachers")]
        public async Task<IActionResult> GetAllTeachers()
        {
            var teachers = await _context.Teachers.ToListAsync();
            return Ok(teachers);
        }

        // ✅ GET: api/admin/teachers/{id}
        [HttpGet("teachers/{id}")]
        public async Task<IActionResult> GetTeacher(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound();
            return Ok(teacher);
        }

        // ✅ POST: api/admin/teachers
        [HttpPost("teachers")]
        public async Task<IActionResult> AddTeacher([FromBody] CreateTeacherDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "A user with this email already exists." });
            }

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber
            };

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "Teacher");

            var teacher = new Teacher
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Gender = dto.Gender,
                Faculty = dto.Faculty,
                Department = dto.Department,
                UserId = user.Id
            };

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Teacher created successfully." });
        }

        // ✅ PUT: api/admin/teachers/{id}
        [HttpPut("teachers/{id}")]
        public async Task<IActionResult> UpdateTeacher(int id, [FromBody] UpdateTeacherDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null)
                return NotFound();

            teacher.FullName = dto.FullName;
            teacher.Email = dto.Email;
            teacher.PhoneNumber = dto.PhoneNumber;
            teacher.Gender = dto.Gender;
            teacher.Faculty = dto.Faculty;
            teacher.Department = dto.Department;
            teacher.UserId = dto.UserId;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Teacher updated successfully." });
        }

        // ✅ DELETE: api/admin/teachers/{id}
        [HttpDelete("teachers/{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound();

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Teacher deleted successfully." });
        }

        // ✅ POST: api/admin/assign-courses
        [HttpPost("assign-courses")]
        public async Task<IActionResult> AssignCourses([FromBody] AssignCourseDto dto)
        {
            var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.UserId == dto.TeacherId);
            if (teacher == null)
                return NotFound(new { message = "Teacher not found." });

            var courses = await _context.Courses
                .Where(c => dto.CourseIds.Contains(c.Id))
                .ToListAsync();

            foreach (var course in courses)
            {
                course.TeacherId = dto.TeacherId;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Courses successfully assigned to teacher." });
        }
    }
}