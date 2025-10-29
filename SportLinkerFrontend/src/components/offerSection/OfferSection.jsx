import OfferFilterSection from "../offerFilterSection/OfferFilterSection";
import OfferCardSection from "./offerCardSection/OfferCardSection";
import "./offerSection.css";

const OfferSection = () => {
  return (
    <div className="offer-section-wrapper">
      <div className="offer-section-headline">
        <h1>Dostępne oferty</h1>
        <p>Znajdź idealnych partnerów do sportu w swojej okolicy</p>
      </div>
      <OfferFilterSection />
      <OfferCardSection />
    </div>
  );
};

export default OfferSection;
