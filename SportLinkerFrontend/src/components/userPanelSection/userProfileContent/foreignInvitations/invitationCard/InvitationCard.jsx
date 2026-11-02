import "./invitationCard.css";
import Tag from "../../../../component-items/tags/Tag";
import Button from "../../../../component-items/button/button";
import Avatar from "../../../../component-items/avatar/Avatar";
import OfferCardDate from "../../../../offerSection/offerCard/OfferCardDate";
import OfferCardLocation from "../../../../offerSection/offerCard/OfferCardLocation";
import OfferCardPeople from "../../../../offerSection/offerCard/OfferCardPeople";
import { FaCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { Link } from "react-router";

const InvitationCard = ({ invitation, handleAccept, handleReject, isBusy = false }) => {
  const buttonSelection = () => {
    if (invitation.status !== "pending") return null;
      return (
        <div className="invitation-btn-wrapper">
          <Button
            style="classicGreenButton"
            onClick={() => handleAccept(invitation.id)}
            Icon={<FaCheck size={24} />}
            disabled={isBusy}
          >
            Akceptuj
          </Button>
          <Button
            style="classicRedButton"
            onClick={() => handleReject(invitation.id)}
            Icon={<MdClose size={24} />}
            disabled={isBusy}
          >
            Odrzuć
          </Button>
        </div>
      );
  };

  return (
    <div className="invitation-card-wrapper">
      <div className="invitation-card-tag-wrapper">
        <div className="invitation-card-block">
          <Tag styleType="sport" text={invitation.sport} />
          <Tag styleType={invitation.status} />
          {invitation.currentPeople >= invitation.maxPeople && (
            <Tag styleType="overpopulation" />
          )}
        </div>
        <div className="invitation-btn-wrapper">{buttonSelection()}</div>
      </div>
      <div className="invitation-user-info-wrapper">
        <Link to={`/profile/userInfo/${invitation.user.id}`} aria-label={`Zobacz profil: ${invitation.user.name}`}><Avatar size={4} /></Link>
        <div className="invitation-join-info">
          <h2><Link className="invitation-user-link" to={`/profile/userInfo/${invitation.user.id}`}>{invitation.user.name}</Link></h2>
          <p>
            Chce dołączyć do{" "}
            <i>
              <Link
                to={`/offer/${invitation.offerId}`}
                style={{ textDecoration: `none`, color: `inherit` }}
              >
                {invitation.offerTitle}
              </Link>
            </i>
          </p>
        </div>
      </div>
      <div className="user-offer-card-info-wrapper">
        <OfferCardDate date={invitation.date} />
        <OfferCardLocation location={invitation.location} />
        <OfferCardPeople
          currentPeople={invitation.currentPeople}
          maxPeople={invitation.maxPeople}
        />
      </div>
    </div>
  );
};

export default InvitationCard;
