import "./offerCard.css";
import { CiCalendar } from "react-icons/ci";

const OfferCardDate = ({ date }) => {
  return (
    <div>
      <CiCalendar color="#3b82f6" size="22px" />
      <p>{date}</p>
    </div>
  );
};

export default OfferCardDate;
