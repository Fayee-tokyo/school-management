using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SchoolManagementAPI.Models;
using SchoolManagementAPI.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SchoolManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly TokenService _tokenService;
        private readonly IConfiguration _configuration;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            TokenService tokenService,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
            _configuration = configuration; 
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
            .Where(e => e.Value.Errors.Count > 0)
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
            );

        return BadRequest(new { Message = "Validation failed", Errors = errors });
            }

             // Role validation
    switch (request.Role?.ToLower())
    {
        case "student":
            if (string.IsNullOrWhiteSpace(request.RegistrationNumber) || request.RegistrationNumber != "VALID-STUDENT-001")
                return BadRequest("Invalid or missing registration number for student.");
            break;
        case "teacher":
        case "admin":
                    var staffCode = _configuration["RegistrationCodes :Admin"];
            if (string.IsNullOrWhiteSpace(request.StaffId) || request.StaffId != "VALID-STAFF-001")
                        return BadRequest("Invalid or missing staff ID for teacher/admin.");
            break;
        case "parent":
            if (string.IsNullOrWhiteSpace(request.ParentCode) || request.ParentCode != "VALID-PARENT-001")
                return BadRequest("Invalid or missing parent code.");
            break;
        default:
            return BadRequest("Invalid role specified.");
    }

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new { Errors = result.Errors });
            }

            string role = request.Role ?? "User";

            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
            }

            await _userManager.AddToRoleAsync(user, role);

            return Ok(new { Message = "User registered successfully!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                return Unauthorized(new { Message = "Invalid email or password." });
            }

            var roles = await _userManager.GetRolesAsync(user);
            var token = _tokenService.GenerateJwtToken(user, roles);

            return Ok(new { Token = token });
        }
    }
}
