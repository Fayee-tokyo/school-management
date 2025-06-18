using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Models;
using SchoolManagementAPI.DTOs.Teacher;

namespace SchoolManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class TeachersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TeachersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeacherDto>>> GetAll()
        {
            var teachers = await _context.Teachers
                .Select(t => new TeacherDto
                {
                    Id = t.Id,
                    FullName = t.FullName,
                    Email = t.Email,
                    PhoneNumber = t.PhoneNumber,
                    Gender = t.Gender,
                    Faculty = t.Faculty,
                    Department = t.Department,
                    UserId = t.UserId
                }).ToListAsync();

            return Ok(teachers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TeacherDto>> GetById(int id)
        {
            var t = await _context.Teachers.FindAsync(id);
            if (t == null) return NotFound();

            return Ok(new TeacherDto
            {
                Id = t.Id,
                FullName = t.FullName,
                Email = t.Email,
                PhoneNumber = t.PhoneNumber,
                Gender = t.Gender,
                Faculty = t.Faculty,
                Department = t.Department,
                UserId = t.UserId
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTeacherDto dto)
        {
            var teacher = new Teacher
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Gender = dto.Gender,
                Faculty = dto.Faculty,
                Department = dto.Department,
                UserId = dto.UserId
            };

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Teacher created successfully." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTeacherDto dto)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound();

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound();

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Teacher deleted successfully." });
        }
    }
}
