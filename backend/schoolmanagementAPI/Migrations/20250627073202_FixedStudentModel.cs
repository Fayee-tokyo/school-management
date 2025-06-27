using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace schoolmanagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class FixedStudentModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Students",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "Department",
                table: "Students",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Faculty",
                table: "Students",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Students",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Department",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "Faculty",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Students");

            migrationBuilder.InsertData(
                table: "Students",
                columns: new[] { "Id", "Class", "DateOfBirth", "FullName", "RegistrationNumber", "UserId" },
                values: new object[] { 1, "First Year", null, "Alice Johnson", "STU001", null });
        }
    }
}
