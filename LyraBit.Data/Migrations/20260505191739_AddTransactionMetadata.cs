using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LyraBit.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionMetadata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Channel",
                table: "Transactions",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeviceId",
                table: "Transactions",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IpAddress",
                table: "Transactions",
                type: "nvarchar(45)",
                maxLength: 45,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Channel",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "DeviceId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "IpAddress",
                table: "Transactions");
        }
    }
}
