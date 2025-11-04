import "./offerCard.css";
import { IoLocationOutline } from "react-icons/io5";

const OfferCardLocation = ({ location }) => {
  return (
    <div>
      <IoLocationOutline color="#3b82f6" size="22px" />
      <p>{location}</p>
    </div>
  );
};

export default OfferCardLocation;
