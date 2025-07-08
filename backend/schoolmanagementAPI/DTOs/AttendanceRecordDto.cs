namespace SchoolManagementAPI.DTOs.Attendance
{
    public class AttendanceRecordDTO
    {
        public string StudentId { get; set; }
        public int CourseId { get; set; }
        public int WeekNumber { get; set; }
        public bool IsPresent { get; set; }
    }
}
