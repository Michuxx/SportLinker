import "./offerCard.css";
import OfferCardBlock from "./OfferCardBlock.jsx";
import OfferCardDescription from "./OfferCardDescription.jsx";
import OfferCardAuthor from "./OfferCardAuthor.jsx";
import OfferCardDate from "./OfferCardDate.jsx";
import OfferCardLocation from "./OfferCardLocation.jsx";
import OfferCardPeople from "./OfferCardPeople.jsx";

const OfferCard = ({
  title,
  sport,
  level,
  description,
  date,
  location,
  currentPeople,
  maxPeople,
  author,
}) => {
  return (
    <div className="offer-card-wrapper">
      <div className="offer-card-headline-wrapper">
        <h3>{title}</h3>
        <OfferCardBlock level={level} sport={sport} />
      </div>
      <OfferCardDescription text={description} />
      <div className="offer-card-info">
        <OfferCardDate date={date} />
        <OfferCardLocation location={location} />
        <OfferCardPeople currentPeople={currentPeople} maxPeople={maxPeople} />
      </div>
      <OfferCardAuthor author={author} />
    </div>
  );
};

export default OfferCard;
