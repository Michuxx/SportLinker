import "./offerCard.css";
import { FiCalendar } from "react-icons/fi";

const OfferCardDate = ({ date }) => {
  return (
    <div>
      <FiCalendar color="#3b82f6" size="22px" />
      <p>{date}</p>
    </div>
  );
};

export default OfferCardDate;
