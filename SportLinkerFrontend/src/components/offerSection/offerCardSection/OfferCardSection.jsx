import "./offerCardSection.css";
import OfferCard from "../offerCard/OfferCard";

const OfferCardSection = ({ userOffers }) => {
  return (
    <section className="offer-card-section-wrapper" id="offers">
      {userOffers.map((offer) => (
        <OfferCard
          key={offer.id}
          id={offer.id}
          title={offer.title}
          sport={offer.sport}
          level={offer.level}
          description={offer.description}
          date={offer.date}
          location={offer.location}
          currentPeople={offer.currentPeople}
          maxPeople={offer.maxPeople}
          author={offer.author}
          mode={offer.mode}
        />
      ))}
    </section>
  );
};

export default OfferCardSection;
