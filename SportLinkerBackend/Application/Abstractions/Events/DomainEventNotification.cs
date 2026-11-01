using Domain.Events;
using MediatR;

namespace Application.Abstractions.Events
{
    public sealed record DomainEventNotification(
    DomainEvent Event) : INotification;
}
