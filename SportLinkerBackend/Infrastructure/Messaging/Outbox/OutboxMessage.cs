namespace Infrastructure.Messaging.Outbox;

public sealed class OutboxMessage
{
    public Guid Id { get; private set; }
    public string Type { get; private set; } = default!;
    public string Payload { get; private set; } = default!;
    public DateTime OccurredAt { get; private set; }
    public DateTime? ProcessedAt { get; private set; }
    public int Attempts { get; private set; }
    public string? LastError { get; private set; }

    private OutboxMessage()
    {
    }

    public static OutboxMessage Create(
        string type,
        string payload,
        DateTime occurredAt)
    {
        return new OutboxMessage
        {
            Id = Guid.NewGuid(),
            Type = type,
            Payload = payload,
            OccurredAt = occurredAt
        };
    }

    public void RegisterAttempt()
    {
        Attempts++;
        LastError = null;
    }

    public void MarkAsPublished()
    {
        ProcessedAt ??= DateTime.UtcNow;
        LastError = null;
    }

    public void RecordFailure(string error)
    {
        LastError = error;
    }
}