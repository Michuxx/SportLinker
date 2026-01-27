import OfferFilter from "./offerFilter/OfferFilter";
import "./offerFilterSection.css";

const OfferFilterSection = ({ filter, onChangeFilter }) => {
  return (
    <section>
      <OfferFilter filter={filter} onChangeFilter={onChangeFilter} />
    </section>
  );
};

export default OfferFilterSection;
