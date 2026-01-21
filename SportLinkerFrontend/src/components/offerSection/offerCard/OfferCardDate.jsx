import useDateFormat from "../../../hooks/useDateFormat";
import "./offerCard.css";
import { FiCalendar } from "react-icons/fi";

const OfferCardDate = ({ date }) => {
  const formattedDate = useDateFormat(date);
  return (
    <div>
      <FiCalendar color="#3b82f6" size="22px" />
      <p>{`${formattedDate.weekday}, ${formattedDate.date} ${formattedDate.time}`}</p>
    </div>
  );
};

export default OfferCardDate;
