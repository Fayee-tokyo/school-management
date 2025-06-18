using System.ComponentModel.DataAnnotations;

namespace SchoolManagementAPI.DTOs.Teacher
{
    public class UpdateTeacherDto
    {
        [Required]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string PhoneNumber { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public string Faculty { get; set; }

        [Required]
        public string Department { get; set; }
        public string UserId { get; set; }
    }
}
