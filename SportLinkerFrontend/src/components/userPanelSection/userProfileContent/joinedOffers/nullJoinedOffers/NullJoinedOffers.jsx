import { Link } from "react-router";
import { FiArrowRight, FiUsers } from "react-icons/fi";
import NullComponent from "../../../../component-items/nullComponent/NullComponent";
import "./nullJoinedOffers.css";

const NullJoinedOffers = () => (
  <div className="null-joined-offers">
    <NullComponent
      icon={<FiUsers size={30} />}
      title="Nie masz jeszcze dołączonych ofert"
      text="Znajdź sportowe spotkanie i dołącz do innych graczy."
    >
      <Link to="/" className="null-joined-offers-link">
        Przeglądaj oferty
        <FiArrowRight size={18} aria-hidden="true" />
      </Link>
    </NullComponent>
  </div>
);

export default NullJoinedOffers;
