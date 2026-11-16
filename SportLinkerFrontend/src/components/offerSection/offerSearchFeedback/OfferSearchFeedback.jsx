import Button from "../../component-items/button/button";
import NullComponent from "../../component-items/nullComponent/NullComponent";
import "./offerSearchFeedback.css";

const OfferSearchFeedback = ({ isLoading, error, empty, hasMore, onRetry, onClear }) => {
  if (isLoading) return <p className="offer-search-feedback" role="status">Ładowanie ofert...</p>;
  if (error) return <div className="offer-search-feedback" role="alert"><p>{error}</p><Button style="gradientButton" onClick={onRetry}>Spróbuj ponownie</Button></div>;
  if (empty) return <NullComponent icon="🔎" title="Brak pasujących ofert" text="Spróbuj zmienić wybrane filtry.">{onClear && <Button style="gradientButton" onClick={onClear}>Wyczyść filtry</Button>}</NullComponent>;
  if (!hasMore) return <p className="offer-search-feedback">To wszystkie pasujące oferty.</p>;
  return null;
};

export default OfferSearchFeedback;
