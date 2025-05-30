using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SchoolManagementAPI.Models;
using SchoolManagementAPI.Services;
using System.Threading.Tasks;

namespace SchoolManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly TokenService _authService;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            TokenService authService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _authService = authService;
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
                const string defaultRole = "User";

                if (!await _roleManager.RoleExistsAsync(defaultRole))
                {
                    await _roleManager.CreateAsync(new IdentityRole(defaultRole));
                }

                await _userManager.AddToRoleAsync(user, defaultRole);

                return Ok(new { Message = "User registered successfully!" });
            }

            return BadRequest(new { Errors = result.Errors });
        }

        // [HttpPost("login")]
        // public async Task<IActionResult> Login([FromBody] LoginRequest request)
        // {
        //     var user = await _userManager.FindByEmailAsync(request.Email);

        //     if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
        //     {
        //         return Unauthorized(new { Message = "Invalid email or password." });
        //     }

        //     var token = await _authService.GenerateJwtToken(user);

        //     return Ok(new { Token = token });
        // }
    }
}
