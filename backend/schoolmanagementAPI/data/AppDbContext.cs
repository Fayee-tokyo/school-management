using System.Net.Sockets;
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
        public DbSet<StudentCourse> StudentCourses { get; set; }
        
        public DbSet<TeacherCourse> TeacherCourses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //  Configure composite primary key for StudentCourse
            modelBuilder.Entity<StudentCourse>()
               .HasKey(sc => new { sc.StudentId, sc.CourseId });

            modelBuilder.Entity<StudentCourse>()
                .HasOne(sc => sc.Student)
                .WithMany(s => s.StudentCourses)
                .HasForeignKey(sc => sc.StudentId);

            modelBuilder.Entity<StudentCourse>()
                .HasOne(sc => sc.Course)
                .WithMany(c => c.StudentCourses)
                .HasForeignKey(sc => sc.CourseId);

            //configure composite primary key for TeacherCourse
            modelBuilder.Entity<TeacherCourse>()
            .HasKey(tc => new { tc.TeacherId, tc.CourseId });

            modelBuilder.Entity<TeacherCourse>()
            .HasOne(tc => tc.Teacher)
            .WithMany(t => t.TeacherCourses)
            .HasForeignKey(tc => tc.TeacherId);

            modelBuilder.Entity<TeacherCourse>()
            .HasOne(tc=> tc.Course)
            .WithMany(c => c.TeacherCourses)
            .HasForeignKey(tc => tc.CourseId);


            // ✅ Sample Seed Data

           // modelBuilder.Entity<Student>().HasData(
                //new Student
                //{
                  //  Id = 1,
                   // FullName = "Alice Johnson",
                   // RegistrationNumber = "STU001",
                    //Class = "First Year",
                    
              //  }
            //);

            modelBuilder.Entity<Courses>().HasData(
                new Courses
                {
                    Id = 1,
                    Title = "Computer Science 101",
                    TeacherId = "1" // Make sure a user with Id "1" exists in ASP.NET Identity
                }
            );

            // modelBuilder.Entity<StudentCourse>().HasData(
            // new StudentCourse
            {
                //     StudentId = 1,
                // CourseId = 1
                // }
                //  );

                // Optional: seed teacher (uncomment if needed and a UserId "1" exists)

                //modelBuilder.Entity<Teacher>().HasData(
                // new Teacher
                //  {
                //    Id = 1,
                //  FullName = "John Doe",
                //Email = "johndoe@example.com",
                //PhoneNumber = "0700000000",
                //Gender = "Male",
                //Faculty = "Engineering",
                //Department = "Computer Science",
                //UserId = "1"
                // }
                // );

            }
        }
    }
}
