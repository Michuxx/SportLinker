using System.Text.Json;
using Application.Messages.IntegrationEvents;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Infrastructure.Messaging.RabbitMq;

public sealed class MessageSentConsumer(
    IServiceScopeFactory scopeFactory,
    IOptions<RabbitMqOptions> options,
    ILogger<MessageSentConsumer> logger)
    : BackgroundService
{
    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ConsumeAsync(stoppingToken);
            }
            catch (OperationCanceledException)
                when (stoppingToken.IsCancellationRequested)
            {
                return;
            }
            catch (Exception exception)
            {
                logger.LogError(
                    exception,
                    "Konsument RabbitMQ przerwał pracę. Ponowienie za 5 sekund.");
            }

            try
            {
                await Task.Delay(
                    TimeSpan.FromSeconds(5),
                    stoppingToken);
            }
            catch (OperationCanceledException)
                when (stoppingToken.IsCancellationRequested)
            {
                return;
            }
        }
    }

    private async Task ConsumeAsync(
        CancellationToken cancellationToken)
    {
        var settings = options.Value;

        var factory = new ConnectionFactory
        {
            HostName = settings.HostName,
            Port = settings.Port,
            UserName = settings.UserName,
            Password = settings.Password,
            VirtualHost = settings.VirtualHost,
            AutomaticRecoveryEnabled = false
        };

        await using var connection = await factory.CreateConnectionAsync(
            cancellationToken: cancellationToken);

        await using var channel = await connection.CreateChannelAsync(
            cancellationToken: cancellationToken);

        await channel.ExchangeDeclareAsync(
            exchange: settings.ExchangeName,
            type: ExchangeType.Direct,
            durable: true,
            autoDelete: false,
            cancellationToken: cancellationToken);

        await channel.QueueDeclareAsync(
            queue: settings.QueueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            cancellationToken: cancellationToken);

        await channel.QueueBindAsync(
            queue: settings.QueueName,
            exchange: settings.ExchangeName,
            routingKey: MessageSentIntegrationEvent.EventType,
            cancellationToken: cancellationToken);

        await channel.BasicQosAsync(
            prefetchSize: 0,
            prefetchCount: 1,
            global: false,
            cancellationToken: cancellationToken);

        var failure = new TaskCompletionSource<Exception>(
            TaskCreationOptions.RunContinuationsAsynchronously);

        channel.ChannelShutdownAsync += (_, reason) =>
        {
            failure.TrySetResult(
                new IOException($"Kanał RabbitMQ zamknięty: {reason.ReplyText}"));

            return Task.CompletedTask;
        };

        var consumer = new AsyncEventingBasicConsumer(channel);

        consumer.UnregisteredAsync += (_, _) =>
        {
            failure.TrySetResult(
                new IOException("Subskrypcja RabbitMQ została anulowana."));

            return Task.CompletedTask;
        };

        consumer.ReceivedAsync += async (_, delivery) =>
        {
            try
            {
                if (delivery.BasicProperties.Type
                    != MessageSentIntegrationEvent.EventType)
                {
                    throw new InvalidOperationException(
                        "Nieobsługiwany typ komunikatu.");
                }

                var integrationEvent =
                    JsonSerializer.Deserialize<MessageSentIntegrationEvent>(
                        delivery.Body.Span);

                if (integrationEvent is null
                    || integrationEvent.MessageId <= 0
                    || integrationEvent.ConversationId <= 0)
                {
                    throw new JsonException(
                        "Nieprawidłowe dane zdarzenia wiadomości.");
                }

                await using var scope = scopeFactory.CreateAsyncScope();

                var dispatcher = scope.ServiceProvider
                    .GetRequiredService<MessageSentDispatcher>();

                await dispatcher.DispatchAsync(
                    integrationEvent,
                    cancellationToken);

                await channel.BasicAckAsync(
                    deliveryTag: delivery.DeliveryTag,
                    multiple: false,
                    cancellationToken: cancellationToken);
            }
            catch (Exception exception)
            {
                // Brak ACK. Zamknięcie kanału zwróci komunikat do kolejki.
                failure.TrySetResult(exception);
            }
        };

        await channel.BasicConsumeAsync(
            queue: settings.QueueName,
            autoAck: false,
            consumer: consumer,
            cancellationToken: cancellationToken);

        logger.LogInformation(
            "Konsument nasłuchuje kolejki {QueueName}.",
            settings.QueueName);

        var exception = await failure.Task.WaitAsync(cancellationToken);

        throw new InvalidOperationException(
            "Obsługa subskrypcji RabbitMQ została przerwana.",
            exception);
    }
}