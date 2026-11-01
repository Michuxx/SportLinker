namespace Domain.Events
{
    public abstract record DomainEvent;

    public sealed record OfferCreated(int AuthorId) : DomainEvent;

    public sealed record ParticipantJoined(
        int OfferId,
        int UserId) : DomainEvent;

    public sealed record OfferRequestSent(
        int OfferId,
        int UserId) : DomainEvent;
    public sealed record OfferInvitationSent(
        int OfferId,
        int UserId) : DomainEvent;
}
