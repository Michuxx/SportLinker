import { useState } from "react";
import NullOffers from "./nullOffers/NullOffers";
import UserOfferCard from "./userOfferCard/UserOfferCard";

const UserOffers = () => {
  const [offers, setOffers] = useState([
    {
      title: "Poszukuję partnera do tenisa",
      sport: "Tenis",
      level: "mid",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "pon., 20.01, 18:00",
      location: "Warszawa, Mokotów",
      currentPeople: 1,
      maxPeople: 2,
      author: "Anna Kowalska",
    },
    {
      title: "Turniej badmintona - szukamy graczy",
      sport: "Badminton",
      level: "easy",
      description:
        "Organizujemy turniej badmintona dla początkujących. Miła atmosfera gwarantowana!",
      date: "pon., 20.01, 18:00",
      location: "Warszawa, Mokotów",
      currentPeople: 1,
      maxPeople: 2,
      author: "Anna Kowalska",
    },
    {
      title: "Poszukuję partnera do tenisa",
      sport: "Tenis",
      level: "expert",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "pon., 20.01, 18:00",
      location: "Warszawa, Mokotów",
      currentPeople: 1,
      maxPeople: 2,
    },
  ]);
  return (
    <div className="user-offers-wrapper">
      {offers.length > 0 ? (
        offers.map((offer) => <UserOfferCard />)
      ) : (
        <NullOffers />
      )}
    </div>
  );
};

export default UserOffers;
