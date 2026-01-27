import "./offerFilter.css";
import { LuFilter } from "react-icons/lu";
import SimpleOfferFilter from "./SimpleOfferFilter.jsx";
import Button from "../component-items/button/button.jsx";

const OfferFilter = ({ filter, onChangeFilter }) => {
  return (
    <div className="filter-wrapper">
      <div className="filter-headline-wrapper">
        <div className="filter-headline">
          <LuFilter color="#3b82f6" size="24px" />
          <h3>Filtruj oferty</h3>
        </div>
        <Button>Zaawansowane</Button>
      </div>
      <div className="filter-input-wrapper">
        <SimpleOfferFilter filter={filter} onChangeFilter={onChangeFilter} />
      </div>
    </div>
  );
};

export default OfferFilter;
