import { FiAlertCircle, FiLoader, FiLock } from "react-icons/fi";
import Button from "../../../../component-items/button/button";
import NullComponent from "../../../../component-items/nullComponent/NullComponent";
import "./joinedOffersFeedback.css";

const JoinedOffersFeedback = ({ type, onRetry }) => {
  if (type === "loading") {
    return (
      <div className="joined-offers-feedback" role="status">
        <FiLoader className="joined-offers-loading-icon" size={28} aria-hidden="true" />
        <p>Ładowanie dołączonych ofert...</p>
      </div>
    );
  }

  if (type === "login") {
    return (
      <div className="joined-offers-feedback">
        <NullComponent icon={<FiLock size={28} />} title="Zaloguj się" text="Zaloguj się, aby zobaczyć oferty, w których bierzesz udział." />
      </div>
    );
  }

  return (
    <div className="joined-offers-feedback" role="alert">
      <NullComponent
        icon={<FiAlertCircle size={28} />}
        title="Nie udało się pobrać ofert"
        text="Sprawdź połączenie i spróbuj ponownie."
      >
        <Button style="gradientButton" onClick={onRetry}>Spróbuj ponownie</Button>
      </NullComponent>
    </div>
  );
};

export default JoinedOffersFeedback;
