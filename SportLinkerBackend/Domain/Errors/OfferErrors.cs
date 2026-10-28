using Domain.Abstractions;

namespace Domain.Errors
{
    public static class OfferErrors
    {
        public static readonly Error OfferNotFound = new(
            "OFFER_NOT_FOUND",
            "Oferta nie istnieje.");
        public static readonly Error OfferRequestNotFound = new(
            "OFFER_REQUEST_NOT_FOUND",
            "Zapytanie o dołączenie nie istnieje.");
        public static readonly Error NotAuthorOfOffer = new(
            "NOT_AUTHOR_OF_OFFER",
            "Osoba nie jest autorem oferty.");
        public static readonly Error CapacityTooLow = new(
            "CAPACITY_TOO_LOW",
            "Obecnie jest więcej osób niż podane maksimum");
        public static readonly Error FullOfferCannotBeAvailable = new(
            "FULL_OFFER_FOR_AVAILABLE",
            "Niepoprawna ilośc osób na otwarcie oferty");
        public static readonly Error AlreadyJoinedToOffer = new(
            "JOINED_TO_OFFER",
            "Dołączono już do oferty");
        public static readonly Error AlreadySentRequestToOffer = new(
            "SENT_REQUEST_TO_OFFER",
            "wysłano już zapytanie o dołączenie");
        public static readonly Error OfferIsNotAvailable = new(
            "NOT_AVAILABLE",
            "Oferta jest niedostępna");
        public static readonly Error MaximumCapacityOfOffer = new(
            "MAXIMUM_CAPACITY_OF_OFFER",
            "W ofercie nie ma już miejsca");
        public static readonly Error AlreadyParticipant = new(
            "ALREADY_PARTICIPANT",
            "Użytkownik jest już uczestnikiem oferty.");
        public static readonly Error WrongRequestStatus = new(
            "WRONG_REQUEST_STATUS",
            "Uzytkownik ma zły status");
    }
}
