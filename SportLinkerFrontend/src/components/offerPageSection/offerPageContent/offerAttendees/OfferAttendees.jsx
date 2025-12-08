import "./offerAttendees.css";
import OfferAuthorCard from "./offerAuthorCard/OfferAuthorCard";
import OfferMemberCard from "./offerMemberCard/OfferMemberCard";

const OfferAttendees = ({ author, members, offerAuthorId }) => {
  return (
    <div className="offer-attendees-container">
      <OfferAuthorCard author={author} />
      <div className="offer-member-list">
        <OfferMemberCard member={author} offerAuthorId={offerAuthorId} />
        {members.map((member) => (
          <OfferMemberCard member={member} offerAuthorId={offerAuthorId} />
        ))}
      </div>
    </div>
  );
};

export default OfferAttendees;
