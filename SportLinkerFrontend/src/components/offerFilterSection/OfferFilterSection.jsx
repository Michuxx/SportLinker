import OfferFilter from "./offerFilter/OfferFilter";
import "./offerFilterSection.css";

const OfferFilterSection = ({ children }) => {
  return (
    <section>
      <div className="offer-section-headline">
        <h1>Dostępne oferty</h1>
        <p>Znajdź idealnych partnerów do sportu w swojej okolicy</p>
      </div>
      <OfferFilter />
    </section>
  );
};

export default OfferFilterSection;
