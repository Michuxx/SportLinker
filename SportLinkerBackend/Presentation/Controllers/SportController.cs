using Application.Sports.Dtos;
using Application.Sports.GetSports;
using MediatR;
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

        [HttpGet]
        public async Task<IActionResult> GetSports(CancellationToken cancellationToken)
        {
            var query = new GetSportsQuery();
            List<SportDto> sports = await _sender.Send(query, cancellationToken);
            return Ok(sports);
        }
    }
}

