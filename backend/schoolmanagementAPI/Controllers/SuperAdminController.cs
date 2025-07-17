using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SchoolManagementAPI.DTOs.Admin;
using SchoolManagementAPI.Models;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace SchoolManagementAPI.Controllers
{
    [Authorize(Roles = "SuperAdmin")]
    [ApiController]
    [Route("api/superadmin")]
    public class SuperAdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public SuperAdminController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest(new { message = "An account with this email already exists." });

            var newUser = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                IsFirstLogin = true
            };

            var result = await _userManager.CreateAsync(newUser, dto.Password);
            if (!result.Succeeded)
                return BadRequest(new { message = "Failed to create admin.", errors = result.Errors });

            await _userManager.AddToRoleAsync(newUser, "Admin");

            return Ok(new { message = "Admin created successfully!" });
        }

        // GET: api/superadmin/get-admins
        [HttpGet("get-admins")]
        public async Task<IActionResult> GetAdmins()
        {
            var admins = await _userManager.GetUsersInRoleAsync("Admin");

            var result = admins.Select(admin => new
            {
                admin.Id,
                admin.FirstName,
                admin.LastName,
                admin.Email
            });

            return Ok(result);
        }
    
    }
}
