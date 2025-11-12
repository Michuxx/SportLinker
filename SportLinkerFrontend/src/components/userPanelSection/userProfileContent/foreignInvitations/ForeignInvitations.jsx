import { useState } from "react";
import InvitationCard from "./invitationCard/InvitationCard";
import NullInvitations from "./nullInvitations/NullInvitations";

const ForeignInvitations = () => {
  const [invitations, setInvitations] = useState([
    // {
    //   id: 1,
    //   status: "pending",
    //   offerTitle: "Poszukuje partnera do tenisa",
    //   sport: "Tenis",
    //   date: "pon., 20.01, 18:00",
    //   location: "Warszawa, Mokotów",
    //   currentPeople: 1,
    //   maxPeople: 2,
    //   user: {
    //     name: "Martusia",
    //   },
    // },
    // {
    //   id: 2,
    //   status: "pending",
    //   offerTitle: "Poszukuje partnera do tenisa",
    //   sport: "Tenis",
    //   date: "pon., 20.01, 18:00",
    //   location: "Warszawa, Mokotów",
    //   currentPeople: 1,
    //   maxPeople: 2,
    //   user: {
    //     name: "Martusia",
    //   },
    // },
    // {
    //   id: 3,
    //   status: "accepted",
    //   offerTitle: "Poszukuje partnera do tenisa",
    //   sport: "Tenis",
    //   date: "pon., 20.01, 18:00",
    //   location: "Warszawa, Mokotów",
    //   currentPeople: 1,
    //   maxPeople: 2,
    //   user: {
    //     name: "Martusia",
    //   },
    // },
  ]);

  return (
    <div className="user-invitations-wrapper">
      {invitations.length > 0 ? (
        invitations.map((invitation) => <InvitationCard />)
      ) : (
        <NullInvitations />
      )}
    </div>
  );
};

export default ForeignInvitations;
