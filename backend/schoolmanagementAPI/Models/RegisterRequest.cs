using System.ComponentModel.DataAnnotations;

namespace SchoolManagementAPI.Models
{
    public class RegisterRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [Phone]
        public string? Phone { get; set; }

        public string? Role { get; set; } = "Student";
        public string? RegistrationNumber { get; set; } // For Student
    public string? StaffId { get; set; } // For Teacher/Admin
    public string? ParentCode { get; set; } // For Parent
    }
}
