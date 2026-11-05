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
}