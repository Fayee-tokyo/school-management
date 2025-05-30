using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    public AdminController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    // Create a new user and assign a role
    [HttpPost("create-user")]
    public async Task<IActionResult> CreateUser(CreateUserDto model)
    {
        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, model.Role);
        return Ok($"User {model.Email} created with role {model.Role}");
    }
}

// DTO
public class CreateUserDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Role { get; set; } = null!;// "Student", "Teacher", "Parent"
}
