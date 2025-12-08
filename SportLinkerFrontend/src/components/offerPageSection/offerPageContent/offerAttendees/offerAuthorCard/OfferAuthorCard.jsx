import "./offerAuthorCard.css";
import Avatar from "../../../../component-items/avatar/Avatar";

const OfferAuthorCard = ({ author }) => {
  return (
    <div className="offer-author-card-container">
      <h3>Organizator</h3>
      <div className="author-info-wrapper">
        <Avatar size={4} />
        <div className="author-info">
          <p className="author-name">{author.name}</p>
          <p className="author-join-date">Dołączył: {author.joinDate}</p>
        </div>
      </div>
    </div>
  );
};

export default OfferAuthorCard;
