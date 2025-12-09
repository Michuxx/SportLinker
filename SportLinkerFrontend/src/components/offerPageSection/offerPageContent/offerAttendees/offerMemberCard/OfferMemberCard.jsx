import "./offerMemberCard.css";
import Avatar from "../../../../component-items/avatar/Avatar";
import Button from "../../../../component-items/button/button";
import { FaRegTrashAlt } from "react-icons/fa";

const OfferMemberCard = ({ member, offerAuthorId }) => {
  return (
    <div className="offer-member-card-container">
      <div className="member-info-block">
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
      {member.id !== offerAuthorId && (
        <div className="member-delete-btn">
          <Button
            style="deleteButton"
            Icon={<FaRegTrashAlt size={20} />}
          ></Button>
        </div>
      )}
    </div>
  );
};

export default OfferMemberCard;
