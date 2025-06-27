namespace SchoolManagementAPI.DTOs.Student
{
    public class CreateStudentDto
    {
        public string FullName { get; set; }
        public string RegistrationNumber { get; set; }
        public string Class { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Email { get; set; } // for user creation
        public string PhoneNumber { get; set; } // optional, for Identity
        public string Gender { get; set; }
        public string Faculty { get; set; }
        public string Department { get; set; }    // optional, for Identity
    }
}
