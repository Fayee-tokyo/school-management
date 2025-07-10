namespace SchoolManagementAPI.DTOs.Attendance
{
    public class AttendanceSubmitDTO
    {
        public int CourseId { get; set; }
        public int WeekNumber { get; set; }
        public List<AttendanceRecordDTO> Records { get; set; }
    }

    public class AttendanceRecordDTO
    {
        public string StudentId { get; set; }
        public bool IsPresent { get; set; }
    }
}
