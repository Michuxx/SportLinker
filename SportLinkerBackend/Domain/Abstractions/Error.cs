namespace Domain.Abstractions
{
    public sealed record Error(string Code, string Message)
    {
        // Pusty błąd (dla sukcesu)
        public static readonly Error None = new(string.Empty, string.Empty);
    }
}
