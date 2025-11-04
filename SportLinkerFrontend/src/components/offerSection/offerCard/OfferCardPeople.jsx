import "./offerCard.css";
import { GoPeople } from "react-icons/go";

const OfferCardPeople = ({ currentPeople, maxPeople }) => {
  return (
    <div>
      <GoPeople color="#3b82f6" size="22px" />
      <p>
        {currentPeople}/{maxPeople} uczestników
      </p>
    </div>
  );
};

export default OfferCardPeople;
