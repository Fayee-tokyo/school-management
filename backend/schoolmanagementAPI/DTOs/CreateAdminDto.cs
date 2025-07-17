using System.ComponentModel.DataAnnotations;

namespace SchoolManagementAPI.DTOs.Admin
{
    public class CreateAdminDto
    {
        [Required]
        public string FirstName { get; set; }
        public string LastName{ get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required, MinLength(6)]
        public string Password { get; set; }

        [Phone]
        public string PhoneNumber { get; set; }
    }
}
