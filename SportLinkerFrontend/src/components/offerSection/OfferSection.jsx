import PageTitle from "../pageTitle/PageTitle";
import OfferCardSection from "./offerCardSection/OfferCardSection";
import OfferFilter from "../offerHomeFilter/OfferFilter";
import OfferSearchFeedback from "./offerSearchFeedback/OfferSearchFeedback";
import OfferSearchLoader from "./offerSearchLoader/OfferSearchLoader";
import { INITIAL_OFFER_FILTER } from "../../utils/offerSearch";
import "./offerSection.css";

const OfferSection = ({ search }) => {
  const { filter, setFilter, offers, errors, isLoading, error, hasMore, loadMore, retry, submitSearch } = search;
  const activeFiltersCount = Object.keys(filter).filter((key) => key !== "locationQuery" && filter[key] !== INITIAL_OFFER_FILTER[key]).length;
  const isDirty = activeFiltersCount > 0 || filter.locationQuery !== "";
  const clearFilters = () => setFilter(INITIAL_OFFER_FILTER);
  const onChangeFilter = ({ target: { name, value } }) => setFilter((previous) => ({
    ...previous, [name]: value,
    ...(name === "locationQuery" ? { location: null } : {}),
    ...(name === "location" ? { locationQuery: value.displayLabel } : {}),
  }));
  return (
    <div className="offer-section-wrapper">
      <PageTitle header="Dostępne oferty" label="Znajdź idealnych partnerów do sportu w swojej okolicy" />
      <OfferFilter filter={filter} onChangeFilter={onChangeFilter} isFilterDirty={isDirty} clearFilters={clearFilters} activeFiltersCount={activeFiltersCount} errors={errors} onSearch={submitSearch} />
      {Object.entries(errors).filter(([field]) => !["location", "title"].includes(field)).map(([field, message]) => <p className="offer-filter-error" role="alert" key={field}>{message}</p>)}
      <OfferCardSection userOffers={offers} />
      <OfferSearchFeedback isLoading={isLoading} error={error} empty={offers.length === 0} hasMore={hasMore} onRetry={retry} />
      <OfferSearchLoader enabled={hasMore && !isLoading && !error} onLoadMore={loadMore} />
    </div>
  );
};
export default OfferSection;
