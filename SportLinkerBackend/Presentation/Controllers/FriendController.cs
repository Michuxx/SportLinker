using Application.Friends.AcceptFriendRequest;
using Application.Friends.CancelFriendRequest;
using Application.Friends.DeleteFriend;
using Application.Friends.RejectFriendRequest;
using Application.Friends.SendFriendRequest;
using Application.Sports.Dtos;
using Application.Sports.GetSports;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Presentation.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FriendController : ControllerBase
    {
        private readonly ISender _sender;

        public FriendController(ISender sender)
        {
            _sender = sender;
        }

        [HttpPost("accept")]
        public async Task<IActionResult> AcceptFriendRequest([FromBody] AcceptFriendRequestCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Error);
            }

            return Ok(result.Value);
        }

        [HttpPost("reject")]
        public async Task<IActionResult> RejectFriendRequest([FromBody] RejectFriendRequestCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Error);
            }
            return Ok(result.Value);
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendFriendRequest([FromBody] SendFriendRequestCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Error);
            }
            return Ok(result.Value);
        }

        [HttpPost("cancel")]
        public async Task<IActionResult> CancelFriendRequest([FromBody] CancelFriendRequestCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Error);
            }
            return Ok(result.Value);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteFriend([FromBody] DeleteFriendCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Error);
            }
            return Ok(result.Value);
        }
    }
}

