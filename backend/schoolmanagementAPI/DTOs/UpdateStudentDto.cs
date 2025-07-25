namespace SchoolManagementAPI.DTOs.Student
{
    public class UpdateStudentDto
    {
        public string FullName { get; set; }
        public string RegistrationNumber { get; set; }
        public string Class { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string PhoneNumber { get; set; }
        public string Faculty { get; set; }
        public string Department { get; set; }
        public string? UserId { get; set; }
    }
}
