using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class LAstReadMessageColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastReadAt",
                table: "ConversationParticipants",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LastReadMessageId",
                table: "ConversationParticipants",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ConversationParticipants_LastReadMessageId",
                table: "ConversationParticipants",
                column: "LastReadMessageId");

            migrationBuilder.AddForeignKey(
                name: "FK_ConversationParticipants_Messages_LastReadMessageId",
                table: "ConversationParticipants",
                column: "LastReadMessageId",
                principalTable: "Messages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConversationParticipants_Messages_LastReadMessageId",
                table: "ConversationParticipants");

            migrationBuilder.DropIndex(
                name: "IX_ConversationParticipants_LastReadMessageId",
                table: "ConversationParticipants");

            migrationBuilder.DropColumn(
                name: "LastReadAt",
                table: "ConversationParticipants");

            migrationBuilder.DropColumn(
                name: "LastReadMessageId",
                table: "ConversationParticipants");
        }
    }
}
