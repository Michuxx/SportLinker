import "./offerAuthorCard.css";
import Avatar from "../../../../component-items/avatar/Avatar";
import { parseApiDate } from "../../../../../utils/dateTime";
import { Link } from "react-router";

const OfferAuthorCard = ({ author }) => {
  const dateObj = parseApiDate(author.joinDate);
  const normalizedDate = dateObj.toLocaleDateString("pl-PL");
  return (
    <div className="offer-author-card-container">
      <h3>Organizator</h3>
      <Link className="author-info-wrapper" to={`/profile/userInfo/${author.id}`} aria-label={`Zobacz profil: ${author.name}`}>
        <Avatar size={4} image={author.image} />
        <div className="author-info">
          <p className="author-name">{author.name}</p>
          <p className="author-join-date">Dołączył: {normalizedDate}</p>
        </div>
      </Link>
    </div>
  );
};

export default OfferAuthorCard;
