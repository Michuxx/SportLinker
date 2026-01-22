import { useState } from "react";
import OfferStatusCard from "./offerStatusCard/OfferStatusCard";
import NullStatuses from "./nullStatuses/nullStatuses";

const OfferStatuses = () => {
  const [statuses, setStatuses] = useState([
    {
      id: 1,
      title: "Poszukuję osób do profesjonalnej rozgrywki w siatkówkę",
      sport: "volleyball",
      date: "2025-01-20T18:00",
      location: {
        long: 19.028552141007275,
        lat: 50.25532955,
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 2,
      availability: "open",
      status: "rejected",
    },
    {
      id: 2,
      title: "Poszukuję osób do profesjonalnej rozgrywki w siatkówkę",
      sport: "volleyball",
      date: "2025-01-20T18:00",
      location: {
        long: 19.028552141007275,
        lat: 50.25532955,
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 5,
      availability: "open",
      status: "accepted",
    },
    {
      id: 3,
      title: "Poszukuję osób do profesjonalnej rozgrywki w siatkówkę",
      sport: "volleyball",
      date: "2025-01-20T18:00",
      location: {
        long: 19.028552141007275,
        lat: 50.25532955,
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 3,
      maxPeople: 3,
      availability: "closed",
      status: "pending",
    },
  ]);
  return (
    <div className="user-offer-statuses-wrapper">
      {statuses.length > 0 ? (
        statuses.map((offerStatus) => (
          <OfferStatusCard offerStatus={offerStatus} key={offerStatus.id} />
        ))
      ) : (
        <NullStatuses />
      )}
    </div>
  );
};

export default OfferStatuses;
