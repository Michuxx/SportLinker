using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class ChangedNamesOfOffertColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ModeEnum",
                table: "Offers",
                newName: "Mode");

            migrationBuilder.RenameColumn(
                name: "AvailabilityEnum",
                table: "Offers",
                newName: "Availability");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Mode",
                table: "Offers",
                newName: "ModeEnum");

            migrationBuilder.RenameColumn(
                name: "Availability",
                table: "Offers",
                newName: "AvailabilityEnum");
        }
    }
}
