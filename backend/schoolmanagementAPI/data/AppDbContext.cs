using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Courses> Courses { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<Attendance> Attendances { get; set; }

        // Add other DbSets (Student, Teacher, etc.) here
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //Teachers
            modelBuilder.Entity<Teacher>().HasData(
                new Teacher { Id = 1, FullName = "John Doe", StaffId = "ST001", Subject = "Computer Science" },
                new Teacher { Id = 2, FullName = "Jane Smith", StaffId = "St002", Subject = "Mathematics" }

            );
            modelBuilder.Entity<Student>().HasData(
                new Student { Id = 1, FullName = "Alice Johnson", RegistrationNumber = "STU001", },
                new Student { Id = 2, FullName = "Bob Green", RegistrationNumber = "STU002" },
                new Student { Id = 3, FullName = "Clara White", RegistrationNumber = "STU003" }
            );

            // Courses
            modelBuilder.Entity<Courses>().HasData(
                new Courses { Id = 1, Title = "Math", StaffId = "TCH001" },
                new Courses { Id = 2, Title = "English", StaffId = "TCH002" }
            );

            // If you're using StudentCourse (many-to-many)
            modelBuilder.Entity<StudentCourse>().HasKey(sc => new { sc.StudentId, sc.CourseId });
            modelBuilder.Entity<StudentCourse>().HasData(
                new { StudentId = 1, CourseId = 1 },
                new { StudentId = 2, CourseId = 1 },
                new { StudentId = 3, CourseId = 2 }
            );
        }
    }
}

            
