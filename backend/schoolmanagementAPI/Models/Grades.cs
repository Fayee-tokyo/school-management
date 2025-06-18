namespace SchoolManagementAPI.Models
{
    public class Grade
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public double Score { get; set; }

        // Foreign Key to Student
        public int StudentId { get; set; }
        public Student Student { get; set; }
        public string TeacherId { get; set; }
    }
}
