import { useState } from "react";
import NullOffers from "./nullOffers/NullOffers";
import UserOfferCard from "./userOfferCard/UserOfferCard";
import ModalBackground from "../../../component-items/modal/ModalBackground";
import DeleteOfferModal from "../../../deleteOfferModal/DeleteOfferModal";

const UserOffers = () => {
  const [selectedOfferToDelete, setSelectedOfferToDelete] = useState(null);
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: "Poszukuję partnera do tenisa",
      sport: "Tenis",
      level: "mid",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "pon., 20.01, 18:00",
      location: "Warszawa, Mokotów",
      currentPeople: 1,
      maxPeople: 2,
      availability: "open",
      mode: "open",
    },
    {
      id: 2,
      title: "Turniej badmintona - szukamy graczy",
      sport: "Badminton",
      level: "easy",
      description:
        "Organizujemy turniej badmintona dla początkujących. Miła atmosfera gwarantowana!",
      date: "pon., 20.01, 18:00",
      location: "Warszawa, Mokotów",
      currentPeople: 1,
      maxPeople: 2,
      availability: "open",
      mode: "open",
    },
    {
      id: 3,
      title: "Poszukuję partnera do tenisa",
      sport: "Tenis",
      level: "expert",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "pon., 20.01, 18:00",
      location: "Warszawa, Mokotów",
      currentPeople: 1,
      maxPeople: 2,
      availability: "closed",
      mode: "closed",
    },
  ]);

  const handleDeleteOffer = (offerId) => {
    setOffers((prevOffers) =>
      prevOffers.filter((offer) => offer.id !== offerId)
    );
  };
  return (
    <div className="user-offers-wrapper">
      {offers.length > 0 ? (
        offers.map((offer) => (
          <UserOfferCard
            offer={offer}
            setSelectedOfferToDelete={() => setSelectedOfferToDelete(offer.id)}
            key={offer.id}
          />
        ))
      ) : (
        <NullOffers />
      )}
      {selectedOfferToDelete && (
        <ModalBackground closeModal={() => setSelectedOfferToDelete(null)}>
          <DeleteOfferModal
            onCancel={() => setSelectedOfferToDelete(null)}
            onConfirm={() => handleDeleteOffer(selectedOfferToDelete)}
          />
        </ModalBackground>
      )}
    </div>
  );
};

export default UserOffers;
