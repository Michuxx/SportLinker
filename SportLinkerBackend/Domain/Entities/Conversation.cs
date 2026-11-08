using Domain.Abstractions;
using Domain.Enums;
using Domain.Errors;

namespace Domain.Entities
{
    public class Conversation
    {
        public int Id { get; set; }
        public int? RelatedOfferId { get; set; }
        public ConversationType Type { get; set; }
        public string? PrivateConversationPairKey { get; private set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Offer? Offer { get; set; }
        public ICollection<Message> Messages { get; set; } = new List<Message>();
        public ICollection<ConversationParticipant> Participants { get; set; } = new List<ConversationParticipant>();

        public static Result<Conversation> CreatePrivateConversation(int senderId, int userId2, string content, Guid clientMessageId)
        {
            var conversation = new Conversation
            {
                Type = ConversationType.Private,
                PrivateConversationPairKey = $"{Math.Min(senderId, userId2)}:{Math.Max(senderId, userId2)}"  
            };

            var result1 = conversation.AddParticipant(senderId);
            if (!result1.IsSuccess)
            {
                return Result<Conversation>.Failure(result1.Error);
            }

            var result2 = conversation.AddParticipant(userId2);
            if (!result2.IsSuccess)
            {
                return Result<Conversation>.Failure(result2.Error);
            }
            var sendMessageResult = conversation.SendMessage(senderId, content, clientMessageId);

            if (!sendMessageResult.IsSuccess)
            {
                return Result<Conversation>.Failure(sendMessageResult.Error);
            }

            return Result<Conversation>.Success(conversation);
        }

        public static Result<Conversation> CreateGroupConversation(int relaterOfferId, int creatorUserId)
        {
            var conversation = new Conversation
            {
                Type = ConversationType.Group,
                RelatedOfferId = relaterOfferId
            };
            var result = conversation.AddParticipant(creatorUserId);
            if (!result.IsSuccess)
            {
                return Result<Conversation>.Failure(result.Error);
            }
            return Result<Conversation>.Success(conversation);
        }

        public Result<bool> AddParticipant(int userId)
        {
            if (Participants.Any(p => p.UserId == userId && p.LeftAt == null))
            {
                return Result<bool>.Failure(MessageErrors.AlreadyParticipantConversation);
            }

            var participant = ConversationParticipant.Create(Id, userId);
            Participants.Add(participant);
            return Result<bool>.Success(true);
        }

        public Result<bool> SendMessage(int senderId, string content, Guid clientMessageId)
        {
            if(string.IsNullOrWhiteSpace(content))
            {
                return Result<bool>.Failure(MessageErrors.InvalidMessageContent);
            }

            if(clientMessageId == Guid.Empty)
            {
                return Result<bool>.Failure(MessageErrors.InvalidClientMessageId);
            }

            if(Type == ConversationType.Group && RelatedOfferId is null)
            {
                return Result<bool>.Failure(MessageErrors.GroupConversationNoOffer);
            }

            var isActiveParticipant = Participants.Any(p => 
                        p.UserId == senderId 
                        && p.LeftAt == null);

            if (!isActiveParticipant)
            {
                return Result<bool>.Failure(MessageErrors.ParticipantNotFound);
            }

            var message = Message.Create(Id, senderId, content, clientMessageId);
            Messages.Add(message);
            return Result<bool>.Success(true);
        }

        public Result<bool> RemoveParticipants(int userId)
        {
            var participants = Participants.Where(p => p.UserId == userId).ToList();
            if (participants.Count == 0)
            {
                return Result<bool>.Failure(MessageErrors.ParticipantNotFound);
            }

            foreach (var participant in participants)
            {
                Participants.Remove(participant);
            }

            return Result<bool>.Success(true);
        }

        public Result<bool> LeaveConversation(int userId)
        {
            var participant = Participants.FirstOrDefault(p => p.UserId == userId && p.LeftAt == null);
            if (participant is null)
            {
                return Result<bool>.Failure(MessageErrors.ParticipantNotFound);
            }
            
            participant.Leave();
            return Result<bool>.Success(true);
        }

        public Result<bool> RestorePrivateParticipants(
            int senderId,
            int receiverId)
        {
            foreach (var userId in new[] { senderId, receiverId })
            {
                var isActive = Participants.Any(
                    p => p.UserId == userId && p.LeftAt == null);

                if (isActive)
                {
                    continue;
                }

                var result = AddParticipant(userId);

                if (!result.IsSuccess)
                {
                    return result;
                }
            }

            return Result<bool>.Success(true);
        }

        public Result<int> GetPrivateRecipientIdFromSenderId(int senderId)
        {
            if (Type != ConversationType.Private)
            {
                return Result<int>.Failure(MessageErrors.NotPrivateConversation);
            }

            if(PrivateConversationPairKey is null)
            {
                return Result<int>.Failure(MessageErrors.NotPrivateConversation);
            }

            var parts = PrivateConversationPairKey?.Split(':');

            if (parts is null
                || parts.Length != 2
                || !int.TryParse(parts[0], out var firstUserId)
                || !int.TryParse(parts[1], out var secondUserId)
                || firstUserId <= 0
                || secondUserId <= 0
                || firstUserId >= secondUserId)
            {
                return Result<int>.Failure(
                    MessageErrors.InvalidPrivateConversationKey);
            }

            if (senderId == firstUserId)
            {
                return Result<int>.Success(secondUserId);
            }

            if (senderId == secondUserId)
            {
                return Result<int>.Success(firstUserId);
            }

            return Result<int>.Failure(MessageErrors.ParticipantNotFound);
        }
    }
}
