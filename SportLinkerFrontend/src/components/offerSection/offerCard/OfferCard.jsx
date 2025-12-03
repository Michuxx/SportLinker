import "./offerCard.css";
import OfferCardBlock from "./OfferCardBlock.jsx";
import OfferCardDescription from "./OfferCardDescription.jsx";
import OfferCardAuthor from "./OfferCardAuthor.jsx";
import OfferCardDate from "./OfferCardDate.jsx";
import OfferCardLocation from "./OfferCardLocation.jsx";
import OfferCardPeople from "./OfferCardPeople.jsx";
import OfferCardMode from "./OfferCardMode.jsx";

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
  mode,
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
        <OfferCardMode mode={mode} />
      </div>
      <OfferCardAuthor author={author} />
    </div>
  );
};

export default OfferCard;
