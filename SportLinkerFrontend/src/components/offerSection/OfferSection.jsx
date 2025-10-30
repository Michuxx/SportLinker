import OfferFilterSection from "../offerFilterSection/OfferFilterSection";
import PageTitle from "../pageTitle/PageTitle";
import OfferCardSection from "./offerCardSection/OfferCardSection";
import "./offerSection.css";

const OfferSection = () => {
  return (
    <div className="offer-section-wrapper">
      <PageTitle
        header="Dostępne oferty"
        label="Znajdź idealnych partnerów do sportu w swojej okolicy"
      />
      <OfferFilterSection />
      <OfferCardSection />
    </div>
  );
};

export default OfferSection;
