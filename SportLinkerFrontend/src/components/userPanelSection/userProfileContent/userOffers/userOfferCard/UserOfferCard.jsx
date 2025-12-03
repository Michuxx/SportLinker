import OfferCardBlock from "../../../../offerSection/offerCard/OfferCardBlock";
import OfferCardDate from "../../../../offerSection/offerCard/OfferCardDate";
import OfferCardDescription from "../../../../offerSection/offerCard/OfferCardDescription";
import OfferCardLocation from "../../../../offerSection/offerCard/OfferCardLocation";
import OfferCardPeople from "../../../../offerSection/offerCard/OfferCardPeople";
import "./userOfferCard.css";
import Button from "../../../../component-items/button/button";
import { FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router";
import OfferCardMode from "../../../../offerSection/offerCard/OfferCardMode";

const UserOfferCard = ({ offer, setSelectedOfferToDelete }) => {
  return (
    <Link
      to={`/offer/${offer.id}`}
      style={{ textDecoration: `none`, color: `inherit` }}
    >
      <div className="user-offer-card-wrapper">
        <div className="user-offer-card-tag-wrapper">
          <OfferCardBlock
            level={offer.level}
            sport={offer.sport}
            availability={offer.availability}
          />
          <div className="user-offer-card-btn-wrapper">
            <Button
              style="deleteButton"
              Icon={<FaRegTrashAlt size={20} />}
              onClick={(e) => {
                e.preventDefault();
                setSelectedOfferToDelete();
              }}
            ></Button>
          </div>
        </div>
        <h3>{offer.title}</h3>
        <OfferCardDescription text={offer.description} />
        <div className="user-offer-card-info-wrapper">
          <OfferCardDate date={offer.date} />
          <OfferCardLocation location={offer.location} />
          <OfferCardPeople
            currentPeople={offer.currentPeople}
            maxPeople={offer.maxPeople}
          />
          <OfferCardMode mode={offer.mode} />
        </div>
      </div>
    </Link>
  );
};

export default UserOfferCard;
