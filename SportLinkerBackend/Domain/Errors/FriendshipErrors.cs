using Domain.Abstractions;

namespace Domain.Errors;

public static class FriendshipErrors
{
    public static readonly Error InvalidUserId = new(
        "FRIENDSHIP_INVALID_USER_ID",
        "Identyfikator użytkownika musi być dodatni.");

    public static readonly Error SameUser = new(
        "FRIENDSHIP_SAME_USER",
        "Nie można utworzyć znajomości z samym sobą.");

    public static readonly Error FriendRequestNotFound = new(
        "FRIEND_REQUEST_NOT_FOUND",
        "Prośba o dodanie do znajomych nie została znaleziona.");
    public static readonly Error FriendshipNotFound = new(
        "FRIENDSHIP_NOT_FOUND",
        "Znajomość nie została znaleziona.");

    public static readonly Error AlreadyFriends = new(
        "FRIENDSHIP_ALREADY_EXISTS",
        "Jesteś już znajomym tego użytkownika.");

    public static readonly Error FriendRequestAlreadySent = new(
            "FRIEND_REQUEST_ALREADY_SENT",
            "Prośba o dodanie do znajomych została już wysłana.");
    public static readonly Error NotRequestReceiver = new(
        "FRIEND_REQUEST_NOT_RECEIVER",
        "Nie jesteś odbiorcą tej prośby o dodanie do znajomych.");  

    public static readonly Error FriendshipStillExists = new(
        "FRIENDSHIP_STILL_EXISTS",
        "Nie można usunąć rozmowy, ponieważ znajomość nadal istnieje.");
}