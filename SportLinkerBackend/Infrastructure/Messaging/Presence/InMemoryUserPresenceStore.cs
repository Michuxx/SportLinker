using Application.Abstractions.Messaging;

namespace Infrastructure.Messaging.Presence;

public sealed class InMemoryUserPresenceStore : IUserPresenceStore
{
    private readonly object _gate = new();

    private readonly Dictionary<int, HashSet<string>> _connections = new();

    public bool AddConnection(int userId, string connectionId)
    {
        lock (_gate)
        {
            if (!_connections.TryGetValue(userId, out var connections))
            {
                connections = new HashSet<string>();
                _connections.Add(userId, connections);
            }

            var added = connections.Add(connectionId);

            return added && connections.Count == 1;
        }
    }

    public bool RemoveConnection(int userId, string connectionId)
    {
        lock (_gate)
        {
            if (!_connections.TryGetValue(userId, out var connections)
                || !connections.Remove(connectionId))
            {
                return false;
            }

            if (connections.Count > 0)
            {
                return false;
            }

            _connections.Remove(userId);

            return true;
        }
    }

    public bool IsOnline(int userId)
    {
        lock (_gate)
        {
            return _connections.ContainsKey(userId);
        }
    }
}