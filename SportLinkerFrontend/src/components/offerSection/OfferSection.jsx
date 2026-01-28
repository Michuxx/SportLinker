import { useState } from "react";
import PageTitle from "../pageTitle/PageTitle";
import OfferCardSection from "./offerCardSection/OfferCardSection";
import "./offerSection.css";
import OfferFilter from "../offerHomeFilter/OfferFilter";

const OfferSection = () => {
  const userOffers = [
    {
      id: "1",
      title: "Poszukuję partnera do tenisa",
      sport: "Tenis",
      level: "intermediate",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "2025-01-20T18:00",
      location: {
        long: 19.028552141007275,
        lat: 50.25532955,
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 2,
      author: "Anna Kowalska",
      mode: "public",
    },
    {
      id: "2",
      title: "Poszukuję partnera do tenisa",
      sport: "Badminton",
      level: "intermediate",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "2025-01-20T18:00",
      location: {
        long: 19.028552141007275,
        lat: 50.25532955,
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 2,
      author: "Anna Kowalska",
      mode: "public",
    },
    {
      id: "3",
      title: "Poszukuję partnera do tenisa",
      sport: "Tenis",
      level: "intermediate",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "2025-01-20T18:00",
      location: {
        long: 19.028552141007275,
        lat: 50.25532955,
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 2,
      author: "Anna Kowalska",
      mode: "public",
    },
    {
      id: "4",
      title: "Poszukuję partnera do tenisa",
      sport: "Tenis",
      level: "intermediate",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "2025-01-20T18:00",
      location: {
        long: 19.028552141007275,
        lat: 50.25532955,
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 2,
      author: "Anna Kowalska",
      mode: "public",
    },
  ];

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
    if (key === "sortType" || key === "sortOrder") return false;

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
