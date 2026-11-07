using Domain.Abstractions;

namespace Domain.Errors
{
    public static class MessageErrors
    {
        public static readonly Error ALREADY_PARTICIPANT_CONVERSATION = new(
        "ALREADY_PARTICIPANT_CONVERSATION",
        "Użytkownik jest już uczestnikiem tej rozmowy.");

        public static readonly Error GROUP_CONVERSATION_NO_OFFER = new(
            "GROUP_CONVERSATION_NO_OFFER",
            "Oferta została zamknięta.");

        public static readonly Error PARTICIPANT_NOT_FOUND = new(
            "PARTICIPANT_NOT_FOUND",
            "Użytkownik nie jest uczestnikiem tej rozmowy.");
        public static readonly Error CONVERSATION_NOT_FOUND = new(
            "CONVERSATION_NOT_FOUND",
            "Rozmowa nie została znaleziona.");

        public static readonly Error INVALID_MESSAGE_CONTENT = new(
            "INVALID_MESSAGE_CONTENT",
            "Treść wiadomości jest nieprawidłowa.");

        public static readonly Error INVALID_CLIENT_MESSAGE_ID = new(
            "INVALID_CLIENT_MESSAGE_ID",
            "Identyfikator wiadomości klienta jest nieprawidłowy.");    
    }
}
