namespace Application.Abstractions.Messaging
{
    public interface IUserPresenceStore
    {
        bool AddConnection(int userId, string connectionId);
        bool RemoveConnection(int userId, string connectionId);
        bool IsOnline(int userId);
    }
}
