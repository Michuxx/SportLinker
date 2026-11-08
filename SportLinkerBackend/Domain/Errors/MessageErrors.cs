using Domain.Abstractions;

namespace Domain.Errors
{
    public static class MessageErrors
    {
        public static readonly Error AlreadyParticipantConversation = new(
        "ALREADY_PARTICIPANT_CONVERSATION",
        "Użytkownik jest już uczestnikiem tej rozmowy.");

        public static readonly Error GroupConversationNoOffer = new(
            "GROUP_CONVERSATION_NO_OFFER",
            "Oferta została zamknięta.");

        public static readonly Error ParticipantNotFound = new(
            "PARTICIPANT_NOT_FOUND",
            "Użytkownik nie jest uczestnikiem tej rozmowy.");
        public static readonly Error ConversationNotFound = new(
            "CONVERSATION_NOT_FOUND",
            "Rozmowa nie została znaleziona.");

        public static readonly Error InvalidMessageContent = new(
            "INVALID_MESSAGE_CONTENT",
            "Treść wiadomości jest nieprawidłowa.");

        public static readonly Error InvalidClientMessageId = new(
            "INVALID_CLIENT_MESSAGE_ID",
            "Identyfikator wiadomości klienta jest nieprawidłowy.");    
        public static readonly Error MessageAlreadySent = new(
            "MESSAGE_ALREADY_SENT",
            "Wiadomość zostałą już wysłana");

        public static readonly Error ClientMessageIdConflict = new(
            "CLIENT_MESSAGE_ID_CONFLICT",
            "Ten identyfikator wiadomości został już użyty dla innych danych.");

        public static readonly Error CannotSendMessageToYourself = new(
            "CANNOT_SEND_MESSAGE_TO_YOURSELF",
            "Nie możesz wysyłać wiadomości do siebie.");

        public static readonly Error NotPrivateConversation = new(
            "NOT_PRIVATE_CONVERSATION",
            "Nie można wysłać wiadomości do tej rozmowy, ponieważ nie jest to rozmowa prywatna.");

        public static readonly Error InvalidPrivateConversationKey = new(
            "INVALID_PRIVATE_CONVERSATION_KEY",
            "Nieprawidłowy klucz rozmowy prywatnej.");
    }
}
