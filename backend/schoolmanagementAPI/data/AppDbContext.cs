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
            .HasOne(tc => tc.Course)
            .WithMany(c => c.TeacherCourses)
            .HasForeignKey(tc => tc.CourseId);

            modelBuilder.Entity<Grade>()
    .HasKey(g => g.Id);

modelBuilder.Entity<Grade>()
    .HasOne(g => g.Student)
    .WithMany(s => s.Grades)
    .HasForeignKey(g => g.StudentId);

modelBuilder.Entity<Grade>()
    .HasOne(g => g.Course)
    .WithMany(c => c.Grades)
    .HasForeignKey(g => g.CourseId);

modelBuilder.Entity<Grade>()
    .HasOne(g => g.Teacher)
    .WithMany()
    .HasForeignKey(g => g.TeacherId);

    modelBuilder.Entity<Student>()
        .HasMany(s => s.Attendances)
        .WithOne(a => a.Student)
        .HasForeignKey(a => a.StudentId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<Courses>()
        .HasMany(c => c.Attendances)
        .WithOne(a => a.Course)
        .HasForeignKey(a => a.CourseId)
        .OnDelete(DeleteBehavior.Cascade);




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

           // modelBuilder.Entity<Courses>().HasData(
             //   new Courses
               // {
                 //   Id = 1,
                   // Title = "Computer Science 101",
                    //TeacherId = "1" // Make sure a user with Id "1" exists in ASP.NET Identity
                //}
            //);

            modelBuilder.Entity<Courses>()
            .HasOne(c => c.Teacher)
            .WithMany(t => t.Courses)
            .HasForeignKey(c => c.TeacherId)
            .HasPrincipalKey(t=> t.UserId) //link to the UserId in the Teacher table
            .IsRequired(false) //allow unassigned
            .OnDelete(DeleteBehavior.SetNull);
            
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

