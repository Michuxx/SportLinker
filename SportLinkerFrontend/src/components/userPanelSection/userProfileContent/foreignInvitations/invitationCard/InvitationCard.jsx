import "./invitationCard.css";
import Tag from "../../../../component-items/tags/Tag";
import Button from "../../../../component-items/button/button";
import Avatar from "../../../../component-items/avatar/Avatar";
import OfferCardDate from "../../../../offerSection/offerCard/OfferCardDate";
import OfferCardLocation from "../../../../offerSection/offerCard/OfferCardLocation";
import OfferCardPeople from "../../../../offerSection/offerCard/OfferCardPeople";
import { FaCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

const InvitationCard = ({ invitation }) => {

  const buttonSelection = () => {
      if (invitation.currentPeople === invitation.maxPeople) {
      return (
      <div className="invitation-btn-wrapper">
        <Button style="classicRedButton" Icon={<FaRegTrashAlt size={20} />}>Usuń</Button>
      </div>
      )
    } else {
      return(
        <div className="invitation-btn-wrapper">
          <Button style="classicGreenButton" Icon={<FaCheck size={24}/>}>Akceptuj</Button>
          <Button style="classicRedButton" Icon={<MdClose size={24} />}>Odrzuć</Button>
        </div>
      )
    }
  }


  return (
    <div className="invitation-card-wrapper">
      <div className="invitation-card-tag-wrapper">
        <div className="invitation-card-block">
          <Tag styleType="sport" text={invitation.sport} />
          <Tag styleType={invitation.status} />
          {invitation.currentPeople === invitation.maxPeople && <Tag styleType="overpopulation"/>}
        </div>
        <div className="invitation-btn-wrapper">
        {buttonSelection()}
        </div>
      </div>
      <div className="invitation-user-info-wrapper">
        <Avatar size={4}/>
        <div className="invitation-join-info">
          <h2>{invitation.user.name}</h2>
          <p>Chce dołączyć do <i>{invitation.offerTitle}</i></p>
        </div>
      </div>
      <div className="user-offer-card-info-wrapper">
        <OfferCardDate date={invitation.date} />
        <OfferCardLocation location={invitation.location} />
        <OfferCardPeople currentPeople={invitation.currentPeople} maxPeople={invitation.maxPeople} />
      </div>
    </div>
  );
};

export default InvitationCard;
