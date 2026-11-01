import { Link } from "react-router";
import { FiAlertCircle, FiArrowLeft, FiRefreshCw, FiSearch, FiWifiOff } from "react-icons/fi";
import "./offerPageError.css";

const errorContent = {
  connection: {
    icon: FiWifiOff,
    label: "Problem z połączeniem",
    title: "Nie możemy połączyć się z serwerem",
    description: "Sprawdź połączenie z internetem i spróbuj ponownie. Jeśli problem się powtarza, wróć za chwilę.",
  },
  notFound: {
    icon: FiSearch,
    label: "Oferta niedostępna",
    title: "Nie znaleźliśmy tej oferty",
    description: "Oferta mogła zostać usunięta lub link jest nieprawidłowy. Wróć do listy i znajdź inne sportowe spotkanie.",
  },
  server: {
    icon: FiAlertCircle,
    label: "Nie udało się wczytać oferty",
    title: "Coś poszło nie tak",
    description: "Nie możemy teraz wyświetlić szczegółów oferty. Spróbuj ponownie lub wróć do przeglądania ofert.",
  },
};

const OfferPageError = ({ type = "server", onRetry }) => {
  const content = errorContent[type] || errorContent.server;
  const Icon = content.icon;

  return (
    <section className="offer-page-section-container offer-page-error" aria-labelledby="offer-page-error-title">
      <div className="offer-page-error-icon" aria-hidden="true"><Icon size={36} /></div>
      <div className="offer-page-error-content" role="alert">
        <span className="offer-page-error-label">{content.label}</span>
        <h1 id="offer-page-error-title">{content.title}</h1>
        <p>{content.description}</p>
      </div>
      <div className="offer-page-error-actions">
        <button type="button" className="offer-page-error-retry" onClick={onRetry}>
          <FiRefreshCw size={18} aria-hidden="true" />
          Spróbuj ponownie
        </button>
        <Link to="/" className="offer-page-error-back">
          <FiArrowLeft size={18} aria-hidden="true" />
          Wróć do ofert
        </Link>
      </div>
    </section>
  );
};

export default OfferPageError;
