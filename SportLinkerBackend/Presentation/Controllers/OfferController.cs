using Application.Offers.CreateOffer;
using Application.Offers.GetOfferDetails;
using Application.Offers.GetOfferRequests;
using Application.Offers.JoinToOffer;
using Application.Offers.UpdateOffer;
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
    }
}

