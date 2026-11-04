import { Link } from "react-router";
import OfferCardBlock from "../../../../offerSection/offerCard/OfferCardBlock";
import OfferCardDate from "../../../../offerSection/offerCard/OfferCardDate";
import OfferCardDescription from "../../../../offerSection/offerCard/OfferCardDescription";
import OfferCardLocation from "../../../../offerSection/offerCard/OfferCardLocation";
import OfferCardPeople from "../../../../offerSection/offerCard/OfferCardPeople";
import "./joinedOfferCard.css";

const JoinedOfferCard = ({ offer }) => (
  <Link to={`/offer/${offer.id}`} className="joined-offer-card">
    <OfferCardBlock sport={offer.sport} level={offer.level} availability={offer.availability} />
    <h2>{offer.title}</h2>
    <OfferCardDescription text={offer.description} />
    <div className="joined-offer-card-info">
      <OfferCardDate date={offer.date} />
      <OfferCardLocation location={offer.location} />
      <OfferCardPeople currentPeople={offer.currentPeople} maxPeople={offer.maxPeople} />
    </div>
  </Link>
);

export default JoinedOfferCard;
