using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.DTOs.Teacher;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _context;
        private Teacher teacher;

        public AdminController(UserManager<ApplicationUser> userManager, AppDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        // Get all users and their roles
        [HttpGet("all-users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = _userManager.Users.ToList();
            var userList = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                userList.Add(new
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    user.PhoneNumber,
                    Roles = roles
                });
            }

            return Ok(userList);
        }

        // Get users by a specific role
        [HttpGet("users-by-role/{role}")]
        public async Task<IActionResult> GetUsersByRole(string role)
        {
            var usersInRole = await _userManager.GetUsersInRoleAsync(role);

            var result = usersInRole.Select(user => new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.PhoneNumber
            });

            return Ok(result);
        }

        // Delete a user by ID
        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found." });

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "User deleted successfully." });
        }

        // Update a user's role
        [HttpPost("update-role")]
        public async Task<IActionResult> UpdateUserRole(string userId, string newRole)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            var currentRoles = await _userManager.GetRolesAsync(user);
            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);

            if (!removeResult.Succeeded)
                return BadRequest(removeResult.Errors);

            var addResult = await _userManager.AddToRoleAsync(user, newRole);
            if (!addResult.Succeeded)
                return BadRequest(addResult.Errors);

            return Ok(new { message = $"User role updated to {newRole}." });
        }

        // ✅ Add Teacher
        [HttpPost("add-teacher")]
        public async Task<IActionResult> AddTeacher([FromBody] CreateTeacherDto dto)
        
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Teacher added successfully." });
        }

        // ✅ Get All Teachers
        [HttpGet("teachers")]
        public IActionResult GetTeachers()
        {
            var teachers = _context.Teachers.ToList();
            return Ok(teachers);
        }
        
        }
 }


