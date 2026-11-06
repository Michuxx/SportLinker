using Application.Users.CreateUser;
using Application.Users.Dtos;
using Application.Users.GetJoinedOffers;
using Application.Users.GetUserData;
using Application.Users.GetUserFriendInvitations;
using Application.Users.GetUserOffers;
using Application.Users.GetUserRequests;
using Application.Users.LoginUser;
using Application.Users.SentOfferRequests;
using Application.Users.UpdateAboutMe;
using Application.Users.UpdateFavouriteSports;
using Application.Users.UpdateUserData;
using Application.Users.UpdateUserImage;
using Application.Users.UserRefreshToken;
using Domain.Abstractions;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ISender _sender;

        public UsersController(ISender sender)
        {
            _sender = sender;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CreateUserCommand command, CancellationToken cancellationToken)
        {

            Result<bool> result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }

            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserCommand command, CancellationToken cancellationToken)
        {
            Result<LoggedUserDto> result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return Unauthorized(new { message = result.Error });
            }

            return Ok(result.Value);
        }

        [HttpPost("refreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenCommand command, CancellationToken cancellationToken)
        {
            Result<LoggedUserDto> result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return Unauthorized(new { message = result.Error });
            }

            return Ok(result.Value);
        }

        [HttpGet("getUserData")]
        public async Task<IActionResult> GetUserData([FromQuery] int userId, CancellationToken cancellationToken)
        {
            int? viewerId = null;
            if (User.Identity?.IsAuthenticated == true)
            {
                if (!int.TryParse(User.FindFirst("id")?.Value, out var id)
                    || id <= 0)
                {
                    return Unauthorized();
                }

                viewerId = id;
            }

            Result<UserDataDto> result = await _sender.Send(new GetUserDataQuery(userId, viewerId), cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }

            return Ok(result.Value);
        }

        [Authorize]
        [HttpPut("updateProfile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileCommand command, CancellationToken cancellationToken)
        {
            Result<UpdatedUser> result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }

            return Ok(result.Value);
        }

        [Authorize]
        [HttpPatch("updateAboutMe")]
        public async Task<IActionResult> UpdateAboutMe([FromBody] UpdateAboutMeCommand command, CancellationToken cancellationToken)
        {
            Result<string?> result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }

            return Ok(new { aboutMe = result.Value });
        }

        [Authorize]
        [HttpPut("updateFavouriteSports")]
        public async Task<IActionResult> UpdateFavouriteSports([FromBody] UpdateFavouriteSportsCommand command, CancellationToken cancellationToken)
        {
            Result<List<int>> result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }

            return Ok(result.Value);
        }

        [Authorize]
        [HttpPost("updateImage")]
        public async Task<IActionResult> UpdateImage(
            [FromForm] ImageType imageType,
            IFormFile file,
            CancellationToken cancellationToken)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Plik obrazu jest wymagany." });
            }

            await using var stream = file.OpenReadStream();
            var command = new UpdateUserImageCommand(stream, file.FileName, imageType);

            Result<string> result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }

            return Ok(new { imageUrl = result.Value });
        }

        [HttpGet("UserOffers")]
        public async Task<IActionResult> GetUserOffers([FromQuery] GetUserOffersQuery query, CancellationToken cancellationToken)
        {
            List<OfferUser> result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("UserRequests")]
        public async Task<IActionResult> GetUserRequests([FromQuery] GetUserRequestsQuery query, CancellationToken cancellationToken)
        {
            List<UserRequestsDto> result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("requests/sent")]
        public async Task<IActionResult> GetSentOfferRequests([FromQuery] SentOfferRequestsQuery query, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("joinedOffers")]
        public async Task<IActionResult> GetJoinedOffers([FromQuery] GetJoinedOffersQuery query, CancellationToken cancellationToken)
        {
            List<JoinedOffersDto> result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("friendInvitations")]
        public async Task<IActionResult> GetUserFriendInvitations([FromQuery] GetUserFriendInvitationsQuery query, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(query, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }
            return Ok(result.Value);
        }
    }
}

