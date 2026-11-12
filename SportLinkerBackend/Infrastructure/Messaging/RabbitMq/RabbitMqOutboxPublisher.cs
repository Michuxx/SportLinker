using Application.Messages.IntegrationEvents;
using Infrastructure.Messaging.Outbox;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using System.Text;

namespace Infrastructure.Messaging.RabbitMq
{
    public class RabbitMqOutboxPublisher : IOutboxPublisher, IAsyncDisposable
    {
        private readonly RabbitMqOptions _options;
        private readonly ConnectionFactory _factory;
        private readonly SemaphoreSlim _gate = new(1, 1);

        private IConnection? _connection;
        private IChannel? _channel;
        private bool _disposed;

        public RabbitMqOutboxPublisher(IOptions<RabbitMqOptions> options)
        {
            _options = options.Value;

            _factory = new ConnectionFactory
            {
                HostName = _options.HostName,
                Port = _options.Port,
                UserName = _options.UserName,
                Password = _options.Password,
                VirtualHost = _options.VirtualHost,

                AutomaticRecoveryEnabled = false
            };
        }

        public async Task PublishAsync(
            OutboxMessage message,
            CancellationToken cancellationToken)
        {
            await _gate.WaitAsync(cancellationToken);

            try
            {
                ObjectDisposedException.ThrowIf(_disposed, this);

                using var timeout = CancellationTokenSource
                    .CreateLinkedTokenSource(cancellationToken);

                timeout.CancelAfter(TimeSpan.FromSeconds(10));

                var channel = await GetChannelAsync(timeout.Token);

                var properties = new BasicProperties
                {
                    MessageId = message.Id.ToString(),
                    Type = message.Type,
                    ContentType = "application/json",
                    Persistent = true
                };

                var body = Encoding.UTF8.GetBytes(message.Payload);

                await channel.BasicPublishAsync(
                    exchange: _options.ExchangeName,
                    routingKey: message.Type,
                    mandatory: true,
                    basicProperties: properties,
                    body: body,
                    cancellationToken: timeout.Token);
            }
            finally
            {
                _gate.Release();
            }
        }

        private async Task<IChannel> GetChannelAsync(
            CancellationToken cancellationToken)
        {
            if (_connection is { IsOpen: true }
                && _channel is { IsOpen: true })
            {
                return _channel;
            }

            await ResetConnectionAsync();

            _connection = await _factory.CreateConnectionAsync(
                cancellationToken: cancellationToken);

            try
            {
                var channelOptions = new CreateChannelOptions(
                    publisherConfirmationsEnabled: true,
                    publisherConfirmationTrackingEnabled: true);

                var channel = await _connection.CreateChannelAsync(
                    options: channelOptions,
                    cancellationToken: cancellationToken);

                _channel = channel;

                await channel.ExchangeDeclareAsync(
                    exchange: _options.ExchangeName,
                    type: ExchangeType.Direct,
                    durable: true,
                    autoDelete: false,
                    cancellationToken: cancellationToken);

                await channel.QueueDeclareAsync(
                    queue: _options.QueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    cancellationToken: cancellationToken);

                await channel.QueueBindAsync(
                    queue: _options.QueueName,
                    exchange: _options.ExchangeName,
                    routingKey: MessageSentIntegrationEvent.EventType,
                    cancellationToken: cancellationToken);

                return channel;
            }
            catch
            {
                await ResetConnectionAsync();
                throw;
            }
        }

        private async Task ResetConnectionAsync()
        {
            var channel = _channel;
            var connection = _connection;

            _channel = null;
            _connection = null;

            try
            {
                if (channel is not null)
                {
                    await channel.DisposeAsync();
                }
            }
            finally
            {
                if (connection is not null)
                {
                    await connection.DisposeAsync();
                }
            }
        }

        public async ValueTask DisposeAsync()
        {
            await _gate.WaitAsync();

            try
            {
                if (_disposed)
                {
                    return;
                }

                _disposed = true;

                await ResetConnectionAsync();
            }
            finally
            {
                _gate.Release();
            }
        }
    }
}
