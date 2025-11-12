import Tag from "../../component-items/tags/Tag";
import "./offerCard.css";

const OfferCardBlock = ({ level, sport, availability }) => {
  return (
    <div className="offer-card-blocks">
      <Tag styleType="sport" text={sport} />
      <Tag styleType={level} />
      <Tag styleType={availability} />
    </div>
  );
};

export default OfferCardBlock;
