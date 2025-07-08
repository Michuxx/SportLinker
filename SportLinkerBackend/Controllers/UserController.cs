using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SportLinkerBackend.Models;
using SportLinkerBackend.Services;

namespace SportLinkerBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly UserService _userService;
        public UserController(ILogger<UserController> logger, UserService userService)
        {
            _logger = logger;
            _userService = userService;
        }


        [HttpPost("createUser")]
        public IActionResult CreateUser([FromBody] User user)
        {
            switch(user)
                {
                case { FirstName: null, LastName: null, Email: null }:
                    return BadRequest("First name, last name, and email are required.");
                case { Password: null }:
                    return BadRequest("Password is required.");
                case { PhoneNumberCountryCode: null, PhoneNumber: null }:
                    return BadRequest("Phone number country code and phone number are required.");
                default:
                    break;
            }
            return Ok(_userService.SetIdForNewUser(user));
        }
    }
}
