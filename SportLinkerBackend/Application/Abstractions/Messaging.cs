using MediatR;

namespace Infrastructure.Abstractions
{
    public interface IQuery<TResponse> : IRequest<TResponse>
    {
    }
    public interface IQueryHandler<TQuery, TResponse> : IRequestHandler<TQuery, TResponse>
        where TQuery : IQuery<TResponse>
    {
    }

    public interface ICommand : IRequest
    {
    }
    public interface ICommandHandler<TCommand> : IRequestHandler<TCommand>
        where TCommand : ICommand
    {
    }
    public interface ICommand<TResponse> : IRequest<TResponse>
    {
    }
    public interface ICommandHandler<TCommand, TResponse> : IRequestHandler<TCommand, TResponse>
        where TCommand : ICommand<TResponse>
    {
    }
}
