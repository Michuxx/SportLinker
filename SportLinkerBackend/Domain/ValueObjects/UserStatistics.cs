using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.ValueObjects
{
    public record UserStatistics
    {
        public int CreatedOffers { get; set; }
        public int JoinedOffers { get; set; }
        public int Invitations { get; set; }
    }
}
