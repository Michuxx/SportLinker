import "./offerCard.css";
import { GrLocation } from "react-icons/gr";

const OfferCardLocation = ({ location }) => {
  return (
    <div>
      <GrLocation color="#3b82f6" size="22px" />
      <p>{location}</p>
    </div>
  );
};

export default OfferCardLocation;
