import "./offerFilter.css";
import { LuFilter } from "react-icons/lu";
import SimpleOfferFilter from "./SimpleOfferFilter.jsx";
import Button from "../component-items/button/button.jsx";
import AdvancedOfferFilter from "./AdvancedOfferFilter.jsx";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";

const OfferFilter = ({ filter, onChangeFilter }) => {
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  return (
    <div className="filter-wrapper">
      <div className="filter-headline-wrapper">
        <div className="filter-headline">
          <LuFilter color="#3b82f6" size="24px" />
          <h3>Filtruj oferty</h3>
        </div>
        <Button onClick={() => setShowAdvancedFilter((e) => !e)}>
          Zaawansowane
          {showAdvancedFilter ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </Button>
      </div>
      <div className="filter-input-wrapper">
        <div className="filter-simple-container">
          <SimpleOfferFilter filter={filter} onChangeFilter={onChangeFilter} />
        </div>
        <div className="filter-advanced-container">
          {showAdvancedFilter && (
            <AdvancedOfferFilter
              filter={filter}
              onChangeFilter={onChangeFilter}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferFilter;
