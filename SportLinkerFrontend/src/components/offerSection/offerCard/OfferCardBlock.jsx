import Tag from "../../component-items/tags/Tag";
import "./offerCard.css";

const OfferCardBlock = ({ level, sport, availability }) => {
  return (
    <div className="offer-card-blocks">
      {sport && <Tag styleType="sport" text={sport} />}
      {level && <Tag styleType={level} />}
      {availability && <Tag styleType={availability} />}
    </div>
  );
};

export default OfferCardBlock;
