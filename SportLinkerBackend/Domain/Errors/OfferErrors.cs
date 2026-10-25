using Domain.Abstractions;

namespace Domain.Errors
{
    public static class OfferErrors
    {
        public static readonly Error OfferNotFound = new(
            "OFFER_NOT_FOUND",
            "Oferta nie istnieje.");
        public static readonly Error NotAuthorOfOffer = new(
            "NOT_AUTHOR_OF_OFFER",
            "Osoba nie jest autorem oferty.");
        public static readonly Error CapacityTooLow = new(
            "CAPACITY_TOO_LOW",
            "Obecnie jest więcej osób niż podane maksimum");
        public static readonly Error FullOfferCannotBeAvailable = new(
            "FULL_OFFER_FOR_AVAILABLE",
            "Niepoprawna ilośc osób na otwarcie oferty");
    }
}
