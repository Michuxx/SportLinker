using Application.Offers.AcceptPendingRequest;
using Application.Offers.CancelRequest;
using Application.Offers.CreateOffer;
using Application.Offers.DeleteParticipantFromOffer;
using Application.Offers.DeleteRejectionRequest;
using Application.Offers.Dtos;
using Application.Offers.Enums;
using Application.Offers.GetOfferDetails;
using Application.Offers.GetOfferRequests;
using Application.Offers.JoinToOffer;
using Application.Offers.LeaveOffer;
using Application.Offers.RejectPendingRequest;
using Application.Offers.SearchOffers;
using Application.Offers.UpdateOffer;
using Application.Users.SentOfferRequests;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfferController : ControllerBase
    {
        private readonly ISender _sender;

        public OfferController(ISender sender)
        {
            _sender = sender;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateOffer([FromBody] CreateOfferCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }

            return Ok(new { offerId = result.Value });
        }

        [AllowAnonymous]
        [HttpGet("{offerId:int}")]
        public async Task<IActionResult> GetOfferDetails(int offerId ,CancellationToken cancellationToken)
        {
            int? userId = null;

            if (User.Identity?.IsAuthenticated == true)
            {
                if (!int.TryParse(User.FindFirst("id")?.Value, out var id)
                    || id <= 0)
                {
                    return Unauthorized();
                }

                userId = id;
            }

            var query = new GetOfferDetailsQuery(offerId, userId);
            var result = await _sender.Send(query, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }

            return Ok(result.Value);
        }

        [Authorize]
        [HttpPatch]
        public async Task<IActionResult> UpdateOfferDetails(UpdateOfferCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if(!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }

            return NoContent();
        }

        [Authorize]
        [HttpPost("Join")]
        public async Task<IActionResult> JoinToOffer(JoinToOfferCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }

            return Ok();
        }

        [Authorize]
        [HttpGet("requests")]
        public async Task<IActionResult> GetOfferRequests([FromQuery] GetOfferRequestsQuery query, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("requests/accept")]
        public async Task<IActionResult> AcceptOfferRequest([FromBody] AcceptPendingRequestCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }
            return Ok(result);
        }

        [Authorize]
        [HttpPost("requests/reject")]
        public async Task<IActionResult> RejectOfferRequest([FromBody] RejectPendingRequestCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }
            return Ok(result);
        }

        [Authorize]
        [HttpPost("participants/delete")]
        public async Task<IActionResult> DeleteParticipant([FromBody] DeleteParticipantFromOfferCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }
            return Ok(result);
        }

        [Authorize]
        [HttpPost("leave")]
        public async Task<IActionResult> LeaveFromOffer([FromBody] LeaveOfferCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }
            return Ok(result);
        }

        [Authorize]
        [HttpPost("requests/cancel")]
        public async Task<IActionResult> CancelRequests([FromBody] CancelRequestCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }
            return Ok(result);
        }
        [Authorize]
        [HttpDelete("requests/delete")]
        public async Task<IActionResult> DeleteRejectionRequest([FromBody] DeleteRejectionRequestCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("search")]
        public async Task<IActionResult> SearchOffers(
            [FromQuery] string? search, 
            [FromQuery] string? country, 
            [FromQuery] string? state, 
            [FromQuery] string? city,
            [FromQuery] int? sportId,
            [FromQuery] DateTimeOffset? dateFrom,
            [FromQuery] DateTimeOffset? dateToExclusive,
            [FromQuery] int? minParticipants,
            [FromQuery] int? maxParticipants,
            [FromQuery] LevelEnum? level,
            [FromQuery] SortOrderEnum sortOrder,
            [FromQuery] SortOptionsEnum sortOption,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12,
            CancellationToken cancellationToken = default)
        {
            int? userId = null;

            if (User.Identity?.IsAuthenticated == true)
            {
                if (!int.TryParse(User.FindFirst("id")?.Value, out var id)
                    || id <= 0)
                {
                    return Unauthorized();
                }

                userId = id;
            }

            OfferSearchLocationDto? location = null;

            if (!string.IsNullOrWhiteSpace(country)
                || !string.IsNullOrWhiteSpace(state)
                || !string.IsNullOrWhiteSpace(city))
            {
                location = new OfferSearchLocationDto
                {
                    Country = country?.Trim(),
                    State = state?.Trim(),
                    City = city?.Trim()
                };
            }

            var query = new SearchOfferQuery(
                userId, 
                search, 
                sportId, 
                location, 
                dateFrom, 
                dateToExclusive, 
                minParticipants, 
                maxParticipants, 
                level, 
                sortOrder, 
                sortOption,
                page,
                pageSize);
            var result = await _sender.Send(query, cancellationToken);

            return Ok(result);
        }
    }
}

