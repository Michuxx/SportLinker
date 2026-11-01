namespace Domain.ValueObjects.User
{
    public record UserStatistics
    {
        public int CreatedOffers { get; private set; }
        public int JoinedOffers { get; private set; }
        public int Invitations { get; private set; }

        public void IncrementCreatedOffers()
        {
            CreatedOffers++;
        }

        public void IncrementJoinedOffers()
        {
            JoinedOffers++;
        }

        public void IncrementInvitations()
        {
            Invitations++;
        }
    }
}
