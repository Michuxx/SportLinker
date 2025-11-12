import { useState } from "react";
import OfferStatusCard from "./offerStatusCard/OfferStatusCard";
import NullStatuses from "./nullStatuses/nullStatuses";

const OfferStatuses = () => {
  const [statuses, setStatuses] = useState([]);
  return (
    <div className="user-offer-statuses-wrapper">
      {statuses.length > 0 ? (
        statuses.map((offerStatus) => <OfferStatusCard />)
      ) : (
        <NullStatuses />
      )}
    </div>
  );
};

export default OfferStatuses;
