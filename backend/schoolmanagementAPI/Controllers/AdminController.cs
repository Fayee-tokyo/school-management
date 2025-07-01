using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.DTOs.Course;
using SchoolManagementAPI.DTOs.Student;
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

        [HttpGet("teachers")]
        public async Task<IActionResult> GetAllTeachers()
        {
            var teachers = await _context.Teachers.ToListAsync();
            return Ok(teachers);
        }

        [HttpGet("teachers/{id}")]
        public async Task<IActionResult> GetTeacher(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound();
            return Ok(teacher);
        }

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

            var result = await _userManager.CreateAsync(user, "Teacher@123");
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

        [HttpDelete("teachers/{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound();

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Teacher deleted successfully." });
        }

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

        [HttpPost("courses")]
        public async Task<IActionResult> AddCourse([FromBody] CreateCourseDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "Title is required." });
            var course = new Courses
            {
                Title = dto.Title
            };
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Course added successfully." });
        }

        [HttpGet("courses")]
        public async Task<IActionResult> GetAllCourses()
        {
            var courses = await _context.Courses.ToListAsync();
            return Ok(courses);
        }

        [HttpPut("courses/{id}")]
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] UpdateCourseDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
                return NotFound(new { message = "Course not found." });

            course.Title = dto.Title;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Course updated successfully." });
        }

        [HttpGet("courses/{id}")]
        public async Task<IActionResult> GetCourseById(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
                return NotFound(new { message = "Course not found." });

            return Ok(course);
        }

        [HttpGet("students")]
        public async Task<IActionResult> GetAllStudents()
        {
            var students = await _context.Students
                .Select(s => new StudentDto
                {
                    Id = s.Id ?? 0,
                    FullName = s.FullName,
                    RegistrationNumber = s.RegistrationNumber,
                    Class = s.Class,
                    Gender = s.Gender,
                    Email = s.Email,
                    PhoneNumber = s.PhoneNumber,
                    Faculty = s.Faculty,
                    Department = s.Department,
                    DateOfBirth = s.DateOfBirth
                }).ToListAsync();

            return Ok(students);
        }

        [HttpGet("students/{id}")]
        public async Task<IActionResult> GetStudentsById(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return NotFound();

            var result = new StudentDto
            {
                Id = student.Id ?? 0,
                FullName = student.FullName,
                RegistrationNumber = student.RegistrationNumber,
                Class = student.Class,
                Gender = student.Gender,
                Email = student.Email,
                PhoneNumber = student.PhoneNumber,
                Faculty = student.Faculty,
                Department = student.Department,
                DateOfBirth = student.DateOfBirth
            };
            return Ok(result);
        }

        [HttpPost("students")]
        public async Task<IActionResult> AddStudent([FromBody] CreateStudentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest(new { message = "A user with this email already exists." });

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
            };

            var result = await _userManager.CreateAsync(user, "Student@123");
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "Student");

            var student = new Student
            {
                FullName = dto.FullName,
                RegistrationNumber = dto.RegistrationNumber,
                Class = dto.Class,
                Gender = dto.Gender,
                Faculty = dto.Faculty,
                Department = dto.Department,
                DateOfBirth = dto.DateOfBirth,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                UserId = user.Id
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Student added successfully." });
        }

        [HttpPut("students/{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] UpdateStudentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return NotFound();

            student.FullName = dto.FullName;
            student.RegistrationNumber = dto.RegistrationNumber;
            student.Class = dto.Class;
            student.Gender = dto.Gender;
            student.Email = dto.Email;
            student.PhoneNumber = dto.PhoneNumber;
            student.Faculty = dto.Faculty;
            student.Department = dto.Department;
            student.DateOfBirth = dto.DateOfBirth;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Student updated successfully." });
        }

        [HttpDelete("students/{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return NotFound();

            var user = await _userManager.FindByIdAsync(student.UserId);
            if (user != null)
                await _userManager.DeleteAsync(user);

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Student deleted successfully." });
        }

        [HttpPost("enroll-student")]
        public async Task<IActionResult> EnrollStudent([FromBody] EnrollStudentDTO dto)
        {
            var student = await _context.Students.FindAsync(dto.StudentId);
            if (student == null)
                return NotFound("Student not found");

            foreach (var courseId in dto.CourseIds)
            {
                bool alreadyEnrolled = await _context.StudentCourses
                    .AnyAsync(sc => sc.StudentId == dto.StudentId && sc.CourseId == courseId);

                if (!alreadyEnrolled)
                {
                    var enrollment = new StudentCourse
                    {
                        StudentId = dto.StudentId,
                        CourseId = courseId
                    };
                    _context.StudentCourses.Add(enrollment);
                }
            }

            await _context.SaveChangesAsync();
            return Ok("Student enrolled successfully.");
        }
        [HttpGet("students-dropdown")]
        public async Task<IActionResult> GetStudentsDropdown()
        {
            var students = await _context.Students
                .Select(s => new { s.Id, s.FullName })
                .ToListAsync();

            return Ok(students);
        }

        [HttpGet("courses-dropdown")]
        public async Task<IActionResult> GetCoursesDropdown()
        {
            var courses = await _context.Courses
                .Select(c => new { c.Id, c.Title })
                .ToListAsync();

            return Ok(courses);
        }

        [HttpDelete("students/{studentId}/unenroll/{courseId}")]
        public async Task<IActionResult> UnenrollStudentFromCourse(int studentId, int courseId)
        {
            var enrollment = await _context.StudentCourses
                .FirstOrDefaultAsync(sc => sc.StudentId == studentId && sc.CourseId == courseId);

            if (enrollment == null)
                return NotFound("Enrollment not found.");

            _context.StudentCourses.Remove(enrollment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Student unenrolled from course successfully." });
        }
        [HttpGet("enrollments")]
        public async Task<IActionResult> GetEnrollments()
        {
            var enrollments = await _context.Students
                .Include(s => s.StudentCourses)
                    .ThenInclude(sc => sc.Course)
                        .ThenInclude(c => c.Teacher)
                .Select(s => new
                {
                    studentId = s.Id,
                    fullName = s.FullName,
                    courses = s.StudentCourses.Select(sc => new
                    {
                        courseId = sc.CourseId,
                        title = sc.Course.Title,
                        teacherName = sc.Course.Teacher != null
                            ? sc.Course.Teacher.FullName
                            : "Unassigned"
                    }).ToList()
                })
                .ToListAsync();

            return Ok(enrollments);
        }






    }
}
