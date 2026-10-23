using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class FixTablesNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Offer_Locations_LocationId",
                table: "Offer");

            migrationBuilder.DropForeignKey(
                name: "FK_Offer_Sports_SportId",
                table: "Offer");

            migrationBuilder.DropForeignKey(
                name: "FK_Offer_Users_AuthorId",
                table: "Offer");

            migrationBuilder.DropForeignKey(
                name: "FK_OfferParticipant_Offer_OfferId",
                table: "OfferParticipant");

            migrationBuilder.DropForeignKey(
                name: "FK_OfferParticipant_Users_UserId",
                table: "OfferParticipant");

            migrationBuilder.DropForeignKey(
                name: "FK_OfferRequest_Offer_OfferId",
                table: "OfferRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_OfferRequest_Users_UserId",
                table: "OfferRequest");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OfferRequest",
                table: "OfferRequest");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OfferParticipant",
                table: "OfferParticipant");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Offer",
                table: "Offer");

            migrationBuilder.RenameTable(
                name: "OfferRequest",
                newName: "OfferRequests");

            migrationBuilder.RenameTable(
                name: "OfferParticipant",
                newName: "OfferParticipants");

            migrationBuilder.RenameTable(
                name: "Offer",
                newName: "Offers");

            migrationBuilder.RenameIndex(
                name: "IX_OfferRequest_UserId",
                table: "OfferRequests",
                newName: "IX_OfferRequests_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_OfferRequest_OfferId",
                table: "OfferRequests",
                newName: "IX_OfferRequests_OfferId");

            migrationBuilder.RenameIndex(
                name: "IX_OfferParticipant_UserId",
                table: "OfferParticipants",
                newName: "IX_OfferParticipants_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_OfferParticipant_OfferId",
                table: "OfferParticipants",
                newName: "IX_OfferParticipants_OfferId");

            migrationBuilder.RenameIndex(
                name: "IX_Offer_SportId",
                table: "Offers",
                newName: "IX_Offers_SportId");

            migrationBuilder.RenameIndex(
                name: "IX_Offer_LocationId",
                table: "Offers",
                newName: "IX_Offers_LocationId");

            migrationBuilder.RenameIndex(
                name: "IX_Offer_AuthorId",
                table: "Offers",
                newName: "IX_Offers_AuthorId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OfferRequests",
                table: "OfferRequests",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OfferParticipants",
                table: "OfferParticipants",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Offers",
                table: "Offers",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OfferParticipants_Offers_OfferId",
                table: "OfferParticipants",
                column: "OfferId",
                principalTable: "Offers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OfferParticipants_Users_UserId",
                table: "OfferParticipants",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OfferRequests_Offers_OfferId",
                table: "OfferRequests",
                column: "OfferId",
                principalTable: "Offers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OfferRequests_Users_UserId",
                table: "OfferRequests",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Offers_Locations_LocationId",
                table: "Offers",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Offers_Sports_SportId",
                table: "Offers",
                column: "SportId",
                principalTable: "Sports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Offers_Users_AuthorId",
                table: "Offers",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OfferParticipants_Offers_OfferId",
                table: "OfferParticipants");

            migrationBuilder.DropForeignKey(
                name: "FK_OfferParticipants_Users_UserId",
                table: "OfferParticipants");

            migrationBuilder.DropForeignKey(
                name: "FK_OfferRequests_Offers_OfferId",
                table: "OfferRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_OfferRequests_Users_UserId",
                table: "OfferRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_Offers_Locations_LocationId",
                table: "Offers");

            migrationBuilder.DropForeignKey(
                name: "FK_Offers_Sports_SportId",
                table: "Offers");

            migrationBuilder.DropForeignKey(
                name: "FK_Offers_Users_AuthorId",
                table: "Offers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Offers",
                table: "Offers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OfferRequests",
                table: "OfferRequests");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OfferParticipants",
                table: "OfferParticipants");

            migrationBuilder.RenameTable(
                name: "Offers",
                newName: "Offer");

            migrationBuilder.RenameTable(
                name: "OfferRequests",
                newName: "OfferRequest");

            migrationBuilder.RenameTable(
                name: "OfferParticipants",
                newName: "OfferParticipant");

            migrationBuilder.RenameIndex(
                name: "IX_Offers_SportId",
                table: "Offer",
                newName: "IX_Offer_SportId");

            migrationBuilder.RenameIndex(
                name: "IX_Offers_LocationId",
                table: "Offer",
                newName: "IX_Offer_LocationId");

            migrationBuilder.RenameIndex(
                name: "IX_Offers_AuthorId",
                table: "Offer",
                newName: "IX_Offer_AuthorId");

            migrationBuilder.RenameIndex(
                name: "IX_OfferRequests_UserId",
                table: "OfferRequest",
                newName: "IX_OfferRequest_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_OfferRequests_OfferId",
                table: "OfferRequest",
                newName: "IX_OfferRequest_OfferId");

            migrationBuilder.RenameIndex(
                name: "IX_OfferParticipants_UserId",
                table: "OfferParticipant",
                newName: "IX_OfferParticipant_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_OfferParticipants_OfferId",
                table: "OfferParticipant",
                newName: "IX_OfferParticipant_OfferId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Offer",
                table: "Offer",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OfferRequest",
                table: "OfferRequest",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OfferParticipant",
                table: "OfferParticipant",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Offer_Locations_LocationId",
                table: "Offer",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Offer_Sports_SportId",
                table: "Offer",
                column: "SportId",
                principalTable: "Sports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Offer_Users_AuthorId",
                table: "Offer",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OfferParticipant_Offer_OfferId",
                table: "OfferParticipant",
                column: "OfferId",
                principalTable: "Offer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OfferParticipant_Users_UserId",
                table: "OfferParticipant",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OfferRequest_Offer_OfferId",
                table: "OfferRequest",
                column: "OfferId",
                principalTable: "Offer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OfferRequest_Users_UserId",
                table: "OfferRequest",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
