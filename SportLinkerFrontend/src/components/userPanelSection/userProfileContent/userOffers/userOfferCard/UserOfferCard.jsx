import OfferCardBlock from "../../../../offerSection/offerCard/OfferCardBlock";
import OfferCardDate from "../../../../offerSection/offerCard/OfferCardDate";
import OfferCardDescription from "../../../../offerSection/offerCard/OfferCardDescription";
import OfferCardLocation from "../../../../offerSection/offerCard/OfferCardLocation";
import OfferCardPeople from "../../../../offerSection/offerCard/OfferCardPeople";
import "./userOfferCard.css";
import Button from "../../../../component-items/button/button";
import { FaRegTrashAlt } from "react-icons/fa";

const UserOfferCard = ({
  title,
  sport,
  level,
  description,
  date,
  location,
  currentPeople,
  maxPeople,
  availability,
  setSelectedOfferToDelete,
}) => {
  return (
    <div className="user-offer-card-wrapper">
      <div className="user-offer-card-tag-wrapper">
        <OfferCardBlock
          level={level}
          sport={sport}
          availability={availability}
        />
        <div className="user-offer-card-btn-wrapper">
          <Button
            style="deleteButton"
            Icon={<FaRegTrashAlt size={20} />}
            onClick={setSelectedOfferToDelete}
          ></Button>
        </div>
      </div>
      <h3>{title}</h3>
      <OfferCardDescription text={description} />
      <div className="user-offer-card-info-wrapper">
        <OfferCardDate date={date} />
        <OfferCardLocation location={location} />
        <OfferCardPeople currentPeople={currentPeople} maxPeople={maxPeople} />
      </div>
    </div>
  );
};

export default UserOfferCard;
