import "./offerMemberCard.css";
import Avatar from "../../../../component-items/avatar/Avatar";

const OfferMemberCard = ({ member, offerAuthorId }) => {
  return (
    <div className="offer-member-card-container">
      <Avatar size={3} />
      <div className="member-info-wrapper">
        <p className="member-name">{member.name}</p>
        {member.id === offerAuthorId ? (
          <p className="author-member">Organizator</p>
        ) : (
          <p className="member-join-date">{member.joinDate}</p>
        )}
      </div>
    </div>
  );
};

export default OfferMemberCard;
