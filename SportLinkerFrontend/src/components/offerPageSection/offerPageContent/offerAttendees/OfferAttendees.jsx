import { useEffect, useState } from "react";
import "./offerAttendees.css";
import OfferAuthorCard from "./offerAuthorCard/OfferAuthorCard";
import OfferMemberCard from "./offerMemberCard/OfferMemberCard";

const OfferAttendees = ({ author, members, offerAuthorId, kickPlayer }) => {
  const [peopleCounter, setPeopleCoutner] = useState();

  useEffect(() => {
    let counter = 1;
    counter += members.length;
    setPeopleCoutner(counter);
  }, []);

  return (
    <div className="offer-attendees-container">
      <OfferAuthorCard author={author} />
      <h3>Uczestnicy ({peopleCounter})</h3>
      <div className="offer-member-list">
        <OfferMemberCard member={author} offerAuthorId={offerAuthorId} />
        {members.map((member) => (
          <OfferMemberCard
            member={member}
            offerAuthorId={offerAuthorId}
            key={member.id}
            kickPlayer={kickPlayer}
          />
        ))}
      </div>
    </div>
  );
};

export default OfferAttendees;
