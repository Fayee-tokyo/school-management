using Microsoft.AspNetCore.Identity;
using SchoolManagementAPI.Models;
using System.Threading.Tasks;

namespace SchoolManagementAPI.Helpers.Seeders
{
    public static class SuperAdminSeeder
    {
        public static async Task SeedSuperAdminAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            var superAdminEmail = "superadmin@school.com";
            var existingUser = await userManager.FindByEmailAsync(superAdminEmail);

            if (existingUser == null)
            {
                var user = new ApplicationUser
                {
                    UserName = superAdminEmail,
                    Email = superAdminEmail,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(user, "SuperAdmin123!");

                if (result.Succeeded)
                {
                    if (!await roleManager.RoleExistsAsync("SuperAdmin"))
                        await roleManager.CreateAsync(new IdentityRole("SuperAdmin"));

                    await userManager.AddToRolesAsync(user, new[] { "SuperAdmin" });
                    Console.WriteLine("✅ Super Admin created");
                }
                else
                {
                    Console.WriteLine("❌ Failed to create Super Admin:");
                    foreach (var error in result.Errors)
                    {
                        Console.WriteLine($"   - {error.Description}");
                    }
                }
            }
            else
            {
                Console.WriteLine("ℹ️ Super Admin already exists");
            }
        }
    }
}
