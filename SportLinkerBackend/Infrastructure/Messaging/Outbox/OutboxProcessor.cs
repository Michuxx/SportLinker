using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Messaging.Outbox;

public sealed class OutboxProcessor(
    IServiceScopeFactory scopeFactory,
    IOutboxPublisher publisher,
    ILogger<OutboxProcessor> logger)
    : BackgroundService
{
    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        try
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessBatchAsync(stoppingToken);
                }
                catch (OperationCanceledException)
                    when (stoppingToken.IsCancellationRequested)
                {
                    throw;
                }
                catch (Exception exception)
                {
                    logger.LogError(
                        exception,
                        "Nie udało się przetworzyć partii Outbox.");
                }

                await Task.Delay(
                    TimeSpan.FromSeconds(2),
                    stoppingToken);
            }
        }
        catch (OperationCanceledException)
            when (stoppingToken.IsCancellationRequested)
        {
            // Zwykłe zakończenie pracy przy wyłączaniu aplikacji.
        }
    }

    private async Task ProcessBatchAsync(
        CancellationToken cancellationToken)
    {
        await using var scope = scopeFactory.CreateAsyncScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<ApplicationDbContext>();

        var messages = await dbContext.OutboxMessages
            .Where(message => message.ProcessedAt == null)
            .OrderBy(message => message.OccurredAt)
            .ThenBy(message => message.Id)
            .Take(20)
            .ToListAsync(cancellationToken);

        foreach (var message in messages)
        {
            cancellationToken.ThrowIfCancellationRequested();

            message.RegisterAttempt();

            try
            {
                await publisher.PublishAsync(
                    message,
                    cancellationToken);
            }
            catch (OperationCanceledException)
                when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception exception)
            {
                message.RecordFailure(exception.Message);

                logger.LogWarning(
                    exception,
                    "Publikacja wpisu Outbox {OutboxId} nie powiodła się. Próba: {Attempts}.",
                    message.Id,
                    message.Attempts);

                await dbContext.SaveChangesAsync(cancellationToken);

                // Po błędzie czekamy do następnego obiegu.
                return;
            }

            message.MarkAsPublished();

            // Zapis jest poza blokiem obsługującym błędy publikacji.
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}