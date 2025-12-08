import { useEffect, useState } from "react";
import "./offerAttendees.css";
import OfferAuthorCard from "./offerAuthorCard/OfferAuthorCard";
import OfferMemberCard from "./offerMemberCard/OfferMemberCard";

const OfferAttendees = ({ author, members, offerAuthorId }) => {
  const [peopleCounter, setPeopleCoutner] = useState();

  useEffect(() => {
    let counter = 1;
    counter += members.length;
    setPeopleCoutner(counter);
  }, []);

  return (
    <div className="offer-attendees-container">
      <OfferAuthorCard author={author} />
      <div className="offer-member-list">
        <h3>Uczestnicy ({peopleCounter})</h3>
        <OfferMemberCard member={author} offerAuthorId={offerAuthorId} />
        {members.map((member) => (
          <OfferMemberCard member={member} offerAuthorId={offerAuthorId} />
        ))}
      </div>
    </div>
  );
};

export default OfferAttendees;
