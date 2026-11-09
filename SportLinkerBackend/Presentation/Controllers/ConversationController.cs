using Application.Messages.CreatePrivateConversation;
using Application.Messages.DeleteConversationFromHistory;
using Application.Messages.GetConversationMessages;
using Application.Messages.GetUserConversations;
using Application.Messages.SendMessage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ConversationController : ControllerBase
    {
        private readonly ISender _sender;

        public ConversationController(ISender sender)
        {
            _sender = sender;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserConversations(CancellationToken cancellationToken)
        {
            var result = await _sender.Send(new GetUserConversationsQuery(), cancellationToken);
            return Ok(result);
        }

        [HttpGet("{conversationId:int}/messages")]
        public async Task<IActionResult> GetConversationMessages(
            [FromRoute] int conversationId,
            CancellationToken cancellationToken,
            [FromQuery] int pageSize = 30,
            [FromQuery] DateTimeOffset? beforeSendAt = null,
            [FromQuery] int? beforeId = null)
        {
            var query = new GetConversationMessagesQuery(
                ConversationId: conversationId,
                BeforeSendAt: beforeSendAt,
                PageSize: pageSize,
                BeforeId: beforeId);

            var result = await _sender.Send(query, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Error);
            }

            return Ok(result.Value);
        }

        [HttpPost("private")]
        public async Task<IActionResult> CreatePrivateConversation(
            [FromBody] CreatePrivateConversationCommand command,
            CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Error);
            }

            return Ok(new { conversationId = result.Value });
        }

        [HttpPost("messages")]
        public async Task<IActionResult> SendMessage(
            [FromBody] SendMessageCommand command,
            CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Error);
            }

            return Ok(result.Value);
        }

        [HttpDelete("{conversationId:int}/history")]
        public async Task<IActionResult> DeleteConversationFromHistory(
            [FromRoute] int conversationId,
            CancellationToken cancellationToken)
        {
            var command = new DeleteConversationFromHistoryCommand(conversationId);
            var result = await _sender.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Error);
            }

            return Ok(result.Value);
        }
    }
}
