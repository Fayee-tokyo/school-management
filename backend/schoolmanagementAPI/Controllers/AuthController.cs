using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SchoolManagementAPI.Models;
using SchoolManagementAPI.Services;
using System.Threading.Tasks;

namespace SchoolManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser > _userManager;
        private readonly RoleManager<IdentityRole> _roleManager; // Added RoleManager
        private readonly TokenService _tokenService;

        public AuthController(
            UserManager<ApplicationUser > userManager,
            RoleManager<IdentityRole> roleManager, // Inject RoleManager
            TokenService tokenService)
        {
            _userManager = userManager;
            _roleManager = roleManager; // Initialize RoleManager
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = new ApplicationUser 
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName
            };


            var result = await _userManager.CreateAsync(user, request.Password);


            if (result.Succeeded)
            {
                // Assign a default role (e.g., "User ") upon registration
                if (!await _roleManager.RoleExistsAsync("User "))
                {
                    await _roleManager.CreateAsync(new IdentityRole("User "));
                }
                await _userManager.AddToRoleAsync(user, "User ");


                return Ok(new { Message = "User  registered successfully!" });
            }

            // Return a standardized error response
            return BadRequest(new { Errors = result.Errors });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);


            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                return Unauthorized(new { Message = "Invalid email or password." });
            }

            var token = _tokenService.CreateToken(user);
            return Ok(new { Token = token });
        }
    }
}