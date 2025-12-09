import "./offerStatusCard.css";
import Tag from "../../../../component-items/tags/Tag";
import OfferCardDate from "../../../../offerSection/offerCard/OfferCardDate";
import OfferCardLocation from "../../../../offerSection/offerCard/OfferCardLocation";
import OfferCardPeople from "../../../../offerSection/offerCard/OfferCardPeople";
import Button from "../../../../component-items/button/button";
import { MdClose } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

const OfferStatusCard = ({ offerStatus }) => {
  const buttonSelection = () => {
    if (
      offerStatus.status === "rejected" ||
      offerStatus.availability === "closed"
    ) {
      return (
        <div className="invitation-btn-wrapper">
          <Button
            style="deleteButton"
            Icon={<FaRegTrashAlt size={20} />}
          ></Button>
        </div>
      );
    } else {
      return (
        <div className="invitation-btn-wrapper">
          <Button style="classicRedButton" Icon={<MdClose size={20} />}>
            Zrezygnuj
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="offer-status-card-wrapper">
      <div className="invitation-card-tag-wrapper">
        <div className="invitation-card-block">
          <Tag styleType="sport" text={offerStatus.sport} />
          <Tag styleType={offerStatus.status} />
          <Tag styleType={offerStatus.availability} />
        </div>
        <div className="invitation-btn-wrapper">{buttonSelection()}</div>
      </div>
      <div className="offer-status-title">
        <h3>{offerStatus.title}</h3>
      </div>
      <div className="user-offer-card-info-wrapper">
        <OfferCardDate date={offerStatus.date} />
        <OfferCardLocation location={offerStatus.location} />
        <OfferCardPeople
          currentPeople={offerStatus.currentPeople}
          maxPeople={offerStatus.maxPeople}
        />
      </div>
    </div>
  );
};

export default OfferStatusCard;
