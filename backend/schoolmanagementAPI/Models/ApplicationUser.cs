using Microsoft.AspNetCore.Identity;

namespace SchoolManagementAPI.Models
{
    public class ApplicationUser : IdentityUser
    {

        public bool IsFirstLogin { get; set; } = true;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        
    
    public Teacher? TeacherProfile{ get; set; }       // For teachers
        
    }
}