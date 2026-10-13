using Application.Users.Dtos;
using Application.Users.GetSports;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SportController : ControllerBase
    {
        private readonly ISender _sender;

        public SportController(ISender sender)
        {
            _sender = sender;
        }

        [Authorize]
        [HttpGet()]
        public async Task<IActionResult> GetSports(CancellationToken cancellationToken)
        {
            var query = new GetSportsQuery();
            List<SportDto> sports = await _sender.Send(query, cancellationToken);
            return Ok(sports);
        }
    }
}

