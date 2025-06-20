using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Helpers
{
    public static class TeacherSeeder
    {
        public static async Task SeedTeachersAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, AppDbContext context)
        {
            // 1. Create default Teacher Identity User
            var teacherEmail = "teacher1@school.com";
            var teacherPassword = "Teacher@123";

            var teacherUser = await userManager.FindByEmailAsync(teacherEmail);
            if (teacherUser == null)
            {
                teacherUser = new ApplicationUser
                {
                    UserName = teacherEmail,
                    Email = teacherEmail,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(teacherUser, teacherPassword);
                if (!result.Succeeded)
                {
                    throw new Exception("Failed to create teacher user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
                }

                if (!await roleManager.RoleExistsAsync("Teacher"))
                {
                    await roleManager.CreateAsync(new IdentityRole("Teacher"));
                }

                await userManager.AddToRoleAsync(teacherUser, "Teacher");
            }

            // 2. Create corresponding Teacher record in the database
            if (!await context.Teachers.AnyAsync(t => t.UserId == teacherUser.Id))
            {
                var teacher = new Teacher
                {
                    FullName = "Jane Teacher",
                    Email = teacherUser.Email,
                    PhoneNumber = "0701234567",
                    Gender = "Female",
                    Faculty = "Science",
                    Department = "Mathematics",
                    UserId= teacherUser.Id,
                
                };

                context.Teachers.Add(teacher);
                await context.SaveChangesAsync();
            }
        }

        internal static async Task SeedTeachersAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, object context)
        {
            throw new NotImplementedException();
        }
    }
}
