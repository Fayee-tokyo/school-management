using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace SchoolManagementAPI.Models
{
    public class Courses
    {
        public int Id { get; set; }
        public string Title { get; set; }

        // Many-to-Many with Students
        public ICollection<Student> Students { get; set; }
        public string StaffId{ get; set; }
    
    }
}
