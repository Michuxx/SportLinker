import MatchCard from "./MatchCard";
import "./offerMatchCards.css";
import { FiCalendar } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { GoPeople } from "react-icons/go";

const OfferMatchCards = ({ date, location, people }) => {
  return (
    <div className="offer-match-cards-container">
      <MatchCard
        title="Termin"
        text={`${date.weekday}, ${date.date} ${date.time}`}
        icon={<FiCalendar size={24} color="#fff" />}
      />
      <MatchCard
        title="Lokalizacja"
        text={location}
        icon={<GrLocation size={24} color="#fff" />}
      />
      <MatchCard
        title="Uczestnicy"
        text={people}
        icon={<GoPeople size={24} color="#fff" />}
      />
    </div>
  );
};

export default OfferMatchCards;
