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
      <span className="sport">{sport}</span>
      <span className={levelStyle}>
        {icon}
        {levelText}
      </span>
      <span className={availabilityClass}>{availabilityText}</span>
    </div>
  );
};

export default OfferCardBlock;
