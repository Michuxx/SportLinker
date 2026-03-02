import { useState } from "react";
import FriendInvitation from "./friendInvitation/FriendInvitation";
import "./friendInvitations.css";

const FriendInvitations = () => {
  const [friendInvitations, setFriendInvitations] = useState([
    {
      id: 3,
      userId: 701,
      name: "Bolek",
      img: null,
      date: "2025-01-20T18:00",
    },
    {
      id: 4,
      userId: 34,
      name: "Lolek",
      img: null,
      date: "2025-01-20T18:00",
    },
    {
      id: 9,
      userId: 230,
      name: "Smrodek",
      img: null,
      date: "2025-01-20T18:00",
    },
  ]);

  return (
    <div className="friend-invitations-wrapper">
      {friendInvitations.map((invitation) => (
        <FriendInvitation invitation={invitation} />
      ))}
    </div>
  );
};

export default FriendInvitations;
