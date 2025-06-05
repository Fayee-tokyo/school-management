using Microsoft.AspNetCore.Identity;

namespace SchoolManagementAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; } 
        public string? RegistrationNumber { get; set; } // For Students
    public string? StaffId { get; set; }             // For Teachers
    public string? AdminKey { get; set; }            // For Admins
    public string? ParentCode { get; set; }          // For Parents

    }
}