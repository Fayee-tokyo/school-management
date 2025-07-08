using System.Collections.Generic;

namespace SchoolManagementAPI.DTOs.Attendance
{
    public class AttendanceSubmitDTO
    {
        public int CourseId { get; set; }
        public int WeekNumber { get; set; }
        public List<AttendanceRecordDTO> Records { get; set; }
    }
}
