using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.DTOs.Attendance;
using SchoolManagementAPI.Models;
using System;
using System.Collections.Generic;
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

        // ✅ GET: api/teacher/courses
        [HttpGet("courses")]
        public async Task<IActionResult> GetAssignedCourses()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var courses = await _context.Courses
                .Where(c => c.TeacherId == userId)
                .ToListAsync();

            return Ok(courses);
        }

        // ✅ GET: api/teacher/enrolled-students
        [HttpGet("enrolled-students")]
        public async Task<IActionResult> GetEnrolledStudents()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.UserId == userId);
            if (teacher == null)
                return NotFound("Teacher not found.");

            var courseIds = await _context.Courses
                .Where(c => c.TeacherId == userId)
                .Select(c => c.Id)
                .ToListAsync();

            var enrolledStudents = await _context.StudentCourses
                .Where(sc => courseIds.Contains(sc.CourseId))
                .Include(sc => sc.Student)
                .Include(sc => sc.Course)
                .Select(sc => new
                {
                    StudentId = sc.StudentId,
                    StudentName = sc.Student.FullName,
                    CourseId = sc.CourseId,
                    CourseTitle = sc.Course.Title,
                })
                .ToListAsync();

            return Ok(enrolledStudents);
        }

        // ✅ POST: api/teacher/grades
        [HttpPost("grades")]
        public async Task<IActionResult> AssignGrade([FromBody] Grade model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var isStudentInCourse = await _context.StudentCourses
                .AnyAsync(sc => sc.StudentId == model.StudentId &&
                                _context.Courses.Any(c => c.Id == sc.CourseId && c.TeacherId == userId));

            if (!isStudentInCourse)
                return Unauthorized("This student is not in your course.");

            model.TeacherId = userId;
            _context.Grades.Add(model);
            await _context.SaveChangesAsync();

            return Ok("Grade assigned.");
        }

        // ✅ POST: api/teacher/mark-attendance
        [HttpPost("mark-attendance")]
        public async Task<IActionResult> MarkAttendance([FromBody] AttendanceSubmitDTO dto)
        {
            if (!ModelState.IsValid)
            {
                foreach (var key in ModelState.Keys)
                {
                    var errors = ModelState[key]?.Errors;
                    if (errors != null && errors.Count > 0)
                    {
                        Console.WriteLine($"❌ {key}: {string.Join(", ", errors.Select(e => e.ErrorMessage))}");

                    }
                    return BadRequest(ModelState);
                }
            }
            var teacherId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == dto.CourseId && c.TeacherId == teacherId);

            if (course == null)
                return Unauthorized("You are not assigned to this course.");

            foreach (var record in dto.Records)
            {
                var existing = await _context.Attendances.FirstOrDefaultAsync(a =>
                    a.CourseId == dto.CourseId &&
                    a.StudentId == int.Parse(record.StudentId) &&
                    a.WeekNumber == dto.WeekNumber);

                if (existing != null)
                {
                    existing.IsPresent = record.IsPresent;
                    existing.DateMarked = DateTime.UtcNow;
                
                }
                else
                {
                    var attendance = new Attendance
                    {
                        CourseId = dto.CourseId,
                        StudentId = int.Parse(record.StudentId),
                        WeekNumber = dto.WeekNumber,
                        IsPresent = record.IsPresent,
                        DateMarked = DateTime.UtcNow,
                        MarkedByTeacherId =teacherId
                    
                    };
                    _context.Attendances.Add(attendance);
                }
            }

            await _context.SaveChangesAsync();
            return Ok("Attendance marked successfully.");
        }

        // ✅ GET: api/teacher/attendance/{courseId}/week/{weekNumber}
        [HttpGet("attendance/{courseId}/week/{weekNumber}")]
        public async Task<IActionResult> GetAttendanceForWeek(int courseId, int weekNumber)
        {
            var teacherId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == courseId && c.TeacherId == teacherId);

            if (course == null)
                return Unauthorized("You are not assigned to this course.");

            var attendanceRecords = await _context.Attendances
                .Where(a => a.CourseId == courseId && a.WeekNumber == weekNumber)
                .Select(a => new AttendanceRecordDTO
                {
                    StudentId = a.StudentId.ToString(),
                    IsPresent = a.IsPresent
                })
                .ToListAsync();

            return Ok(attendanceRecords);
        }

        // ✅ (Optional) legacy: GET students
        [HttpGet("students")]
        public async Task<IActionResult> GetStudents()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var students = await _context.Courses
                .Where(c => c.TeacherId == userId)
                .Include(c => c.Students)
                .SelectMany(c => c.Students)
                .Distinct()
                .ToListAsync();

            return Ok(students);
        }
    }
}