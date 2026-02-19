import { useState } from "react";
import PageTitle from "../pageTitle/PageTitle";
import OfferCardSection from "./offerCardSection/OfferCardSection";
import "./offerSection.css";
import OfferFilter from "../offerHomeFilter/OfferFilter";

const OfferSection = ({ userOffers }) => {
  const INITIAL_FILTER = {
    title: "",
    sport: "all",
    location: "",
    level: "all",
    startDate: "",
    endDate: "",
    minPlayers: null,
    maxPlayers: null,
    sortType: "players",
    sortOrder: "ASC",
  };

  const [filter, setFilter] = useState(INITIAL_FILTER);

  const isDirty = JSON.stringify(filter) !== JSON.stringify(INITIAL_FILTER);

  const onChangeFilter = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilter(INITIAL_FILTER);
  };

  const activeFiltersCount = Object.keys(filter).filter((key) => {
    // if (key === "sortType" || key === "sortOrder") return false;

    return filter[key] !== INITIAL_FILTER[key];
  }).length;

  return (
    <div className="offer-section-wrapper">
      <PageTitle
        header="Dostępne oferty"
        label="Znajdź idealnych partnerów do sportu w swojej okolicy"
      />
      <OfferFilter
        filter={filter}
        onChangeFilter={onChangeFilter}
        isFilterDirty={isDirty}
        clearFilters={clearFilters}
        activeFiltersCount={activeFiltersCount}
      />
      <OfferCardSection userOffers={userOffers} />
    </div>
  );
};

export default OfferSection;
