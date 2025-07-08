using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace schoolmanagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddAttendanceModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TeacherId",
                table: "Attendances",
                newName: "MarkedByTeacherId");

            migrationBuilder.RenameColumn(
                name: "Present",
                table: "Attendances",
                newName: "IsPresent");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Attendances",
                newName: "DateMarked");

            migrationBuilder.AlterColumn<string>(
                name: "StudentId",
                table: "Attendances",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "CourseId",
                table: "Attendances",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StudentId1",
                table: "Attendances",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "WeekNumber",
                table: "Attendances",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_CourseId",
                table: "Attendances",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_StudentId1",
                table: "Attendances",
                column: "StudentId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_Courses_CourseId",
                table: "Attendances",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_Students_StudentId1",
                table: "Attendances",
                column: "StudentId1",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_Courses_CourseId",
                table: "Attendances");

            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_Students_StudentId1",
                table: "Attendances");

            migrationBuilder.DropIndex(
                name: "IX_Attendances_CourseId",
                table: "Attendances");

            migrationBuilder.DropIndex(
                name: "IX_Attendances_StudentId1",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "CourseId",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "StudentId1",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "WeekNumber",
                table: "Attendances");

            migrationBuilder.RenameColumn(
                name: "MarkedByTeacherId",
                table: "Attendances",
                newName: "TeacherId");

            migrationBuilder.RenameColumn(
                name: "IsPresent",
                table: "Attendances",
                newName: "Present");

            migrationBuilder.RenameColumn(
                name: "DateMarked",
                table: "Attendances",
                newName: "Date");

            migrationBuilder.AlterColumn<int>(
                name: "StudentId",
                table: "Attendances",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
