import Tag from "../../component-items/tags/Tag";
import "./offerCard.css";

const OfferCardBlock = ({
  levelStyle,
  sport,
  levelText,
  icon,
  availabilityText,
  availabilityClass,
}) => {
  return (
    <div className="offer-card-blocks">
      <Tag styleType="sport" text={sport} />
      <Tag styleType={levelStyle} text={levelText} icon={icon} />
      <Tag styleType={availabilityClass} text={availabilityText} />
    </div>
  );
};

export default OfferCardBlock;
