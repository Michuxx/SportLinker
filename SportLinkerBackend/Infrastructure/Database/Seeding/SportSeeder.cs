namespace Infrastructure.Database.Seeding;

internal static class SportsSeeder
{
    public static readonly string Sql = LoadSql();

    private static string LoadSql()
    {
        using var stream = typeof(SportsSeeder).Assembly
            .GetManifestResourceStream(
                "Infrastructure.Database.Seeding.Sports.sql")
            ?? throw new InvalidOperationException(
                "Nie znaleziono skryptu inicjalizacji sportów.");

        using var reader = new StreamReader(stream);

        return reader.ReadToEnd();
    }
}