using System.ComponentModel.DataAnnotations;

namespace SchoolManagementAPI.Models
{
    public class Teacher
    {
        public int Id { get; set; } // Primary Key

        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Gender { get; set; }
        public string Faculty { get; set; }
        public string Department { get; set; }

        // This will link to the Identity User table
        [Required]
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public ICollection<TeacherCourse> TeacherCourses { get; set; }
    }
}
