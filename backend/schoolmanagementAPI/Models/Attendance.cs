public class Attendance
{
    public int Id { get; set; }
    public int StudentId { get; set; }


    public DateTime Date { get; set; }
    public bool Present { get; set; }

    public string TeacherId { get; set; } // who marked it
}
