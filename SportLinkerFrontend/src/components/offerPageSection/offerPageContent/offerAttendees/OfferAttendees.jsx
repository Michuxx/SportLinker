import "./offerAttendees.css";
import OfferAuthorCard from "./offerAuthorCard/OfferAuthorCard";
import OfferMemberCard from "./offerMemberCard/OfferMemberCard";

const OfferAttendees = ({ author, members, offerAuthorId, kickPlayer, isAuthor = false, isBusy = false }) => {
  return (
    <div className="offer-attendees-container">
      <OfferAuthorCard author={author} />
      <h3>Uczestnicy ({members.length})</h3>
      <div className="offer-member-list">
        {members.map((member) => (
          <OfferMemberCard
            member={member}
            offerAuthorId={offerAuthorId}
            key={member.id}
            kickPlayer={kickPlayer}
            isAuthor={isAuthor}
            isBusy={isBusy}
          />
        ))}
      </div>
    </div>
  );
};

export default OfferAttendees;
