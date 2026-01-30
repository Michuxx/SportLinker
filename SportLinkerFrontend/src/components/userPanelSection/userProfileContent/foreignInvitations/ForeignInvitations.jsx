import { useState } from "react";
import InvitationCard from "./invitationCard/InvitationCard";
import NullInvitations from "./nullInvitations/NullInvitations";

const ForeignInvitations = () => {
  const [invitations, setInvitations] = useState([
    {
      id: 1,
      offerId: 1,
      status: "pending",
      offerTitle: "Poszukuje partnera do tenisa",
      sport: "Tenis",
      date: "2025-01-20T18:00",
      location: {
        long: 19.028552141007275,
        lat: 50.25532955,
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 2,
      user: {
        name: "Martusia",
      },
    },
    {
      id: 2,
      offerId: 1,
      status: "pending",
      offerTitle: "Poszukuje partnera do tenisa",
      sport: "Tenis",
      date: "2025-01-20T18:00",
      location: {
        long: 19.028552141007275,
        lat: 50.25532955,
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 2,
      user: {
        name: "Martusia",
      },
    },
    {
      id: 4,
      offerId: 3,
      status: "pending",
      offerTitle: "Koooooszykufka",
      sport: "Tenis",
      date: "2025-01-20T18:00",
      location: {
        long: 19.028552141007275,
        lat: 50.25532955,
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 2,
      maxPeople: 2,
      user: {
        name: "Martusia",
      },
    },
  ]);

  const handleAcceptInvitation = (id, offerId) => {
    setInvitations((prevInvitations) => {
      return prevInvitations
        .filter((inv) => inv.id !== id)
        .map((invitation) => {
          if (invitation.offerId === offerId) {
            return {
              ...invitation,
              currentPeople: invitation.currentPeople + 1,
            };
          }
          return invitation;
        });
    });
  };

  return (
    <div className="user-invitations-wrapper">
      {invitations.length > 0 ? (
        invitations.map((invitation) => (
          <InvitationCard
            invitation={invitation}
            key={invitation.id}
            handleAccept={handleAcceptInvitation}
          />
        ))
      ) : (
        <NullInvitations />
      )}
    </div>
  );
};

export default ForeignInvitations;
