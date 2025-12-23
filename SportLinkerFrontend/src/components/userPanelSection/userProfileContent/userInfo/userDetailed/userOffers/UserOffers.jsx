import { useState } from "react";
import NullOffers from "./nullOffers/NullOffers";
import UserOfferCard from "./userOfferCard/UserOfferCard";
import WarningModal from "../../../../../warningModal/WarningModal";
import { FaRegTrashAlt } from "react-icons/fa";
import "./userOffers.css";
import ModalBackground from "../../../../../component-items/modal/ModalBackground";
import PageTitle from "../../../../../pageTitle/PageTitle";
import Button from "../../../../../component-items/button/button";
import CreateOfferModal from "../../../../../createOfferModal/CreateOfferModal";

const UserOffers = () => {
  const [selectedOfferToDelete, setSelectedOfferToDelete] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: "Poszukuję partnera do tenisa",
      sport: "Tenis",
      level: "intermediate",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "pon., 20.01, 18:00",
      location: "Warszawa, Mokotów",
      currentPeople: 1,
      maxPeople: 2,
      availability: "open",
      mode: "public",
    },
    {
      id: 2,
      title: "Turniej badmintona - szukamy graczy",
      sport: "Badminton",
      level: "beginner",
      description:
        "Organizujemy turniej badmintona dla początkujących. Miła atmosfera gwarantowana!",
      date: "pon., 20.01, 18:00",
      location: "Warszawa, Mokotów",
      currentPeople: 1,
      maxPeople: 2,
      availability: "open",
      mode: "public",
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
      mode: "private",
    },
  ]);

  const handleDeleteOffer = (offerId) => {
    setOffers((prevOffers) =>
      prevOffers.filter((offer) => offer.id !== offerId)
    );
  };
  return (
    <div className="user-offers-wrapper">
      <div className="profile-offer-header-wrapper">
        <PageTitle header="Moje oferty" label="Oferty, które utworzyłeś" />
        <Button
          style="gradientButton"
          width={20}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Utwórz ofertę
        </Button>
      </div>
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
          <WarningModal
            onCancel={() => setSelectedOfferToDelete(null)}
            onConfirm={() => handleDeleteOffer(selectedOfferToDelete)}
            headline="Czy na pewno chcesz usunąć tę ofertę?"
            paragraph="ten proces jest nieodwracalny"
            confirmText="Usuń"
            confirmIcon={<FaRegTrashAlt size={20} />}
          />
        </ModalBackground>
      )}
      {isCreateModalOpen && (
        <ModalBackground closeModal={() => setIsCreateModalOpen(false)}>
          <CreateOfferModal />
        </ModalBackground>
      )}
    </div>
  );
};

export default UserOffers;
