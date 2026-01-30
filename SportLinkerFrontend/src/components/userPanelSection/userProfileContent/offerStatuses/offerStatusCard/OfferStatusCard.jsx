import "./offerStatusCard.css";
import Tag from "../../../../component-items/tags/Tag";
import OfferCardDate from "../../../../offerSection/offerCard/OfferCardDate";
import OfferCardLocation from "../../../../offerSection/offerCard/OfferCardLocation";
import OfferCardPeople from "../../../../offerSection/offerCard/OfferCardPeople";
import Button from "../../../../component-items/button/button";
import { MdClose } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router";

const OfferStatusCard = ({ offerApplication, handleResign }) => {
  return (
    <Link
      to={`/offer/${offerApplication.offerId}`}
      style={{ textDecoration: `none`, color: `inherit` }}
    >
      <div className="offer-status-card-wrapper">
        <div className="invitation-card-tag-wrapper">
          <div className="invitation-card-block">
            <Tag styleType="sport" text={offerApplication.sport} />
            <Tag styleType={offerApplication.status} />
            <Tag styleType={offerApplication.availability} />
          </div>
          <div className="invitation-btn-wrapper">
            <Button
              style="classicRedButton"
              onClick={(e) => {
                e.preventDefault();
                handleResign(offerApplication.id);
              }}
              Icon={<MdClose size={20} />}
            >
              Zrezygnuj
            </Button>
          </div>
        </div>
        <div className="offer-status-title">
          <h3>{offerApplication.title}</h3>
        </div>
        <div className="user-offer-card-info-wrapper">
          <OfferCardDate date={offerApplication.date} />
          <OfferCardLocation location={offerApplication.location} />
          <OfferCardPeople
            currentPeople={offerApplication.currentPeople}
            maxPeople={offerApplication.maxPeople}
          />
        </div>
      </div>
    </Link>
  );
};

export default OfferStatusCard;
