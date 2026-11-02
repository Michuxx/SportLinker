import { useState } from "react";
import NullOffers from "./nullOffers/NullOffers";
import UserOfferCard from "./userOfferCard/UserOfferCard";
import "./userOffers.css";
import ModalBackground from "../../../../../component-items/modal/ModalBackground";
import PageTitle from "../../../../../pageTitle/PageTitle";
import Button from "../../../../../component-items/button/button";
import CreateOfferModal from "../../../../../createOfferModal/CreateOfferModal";
import NullComponent from "../../../../../component-items/nullComponent/NullComponent";
import useUserOfferList from "../../../../../../hooks/useUserOfferList";

const UserOffers = ({ userId, isOwner = false }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { items: offers, setItems: setOffers, isLoading, error, reload } = useUserOfferList(userId);

  return (
    <div className="user-offers-wrapper">
      <div className="profile-offer-header-wrapper">
        <PageTitle header={isOwner ? "Moje oferty" : "Oferty użytkownika"}
          label={isOwner ? "Oferty, które utworzyłeś" : "Oferty utworzone przez użytkownika"} />
        {isOwner && <Button style="gradientButton" onClick={() => setIsCreateModalOpen(true)}>Utwórz ofertę</Button>}
      </div>
      {isLoading ? <p className="user-offers-feedback" role="status">Ładowanie ofert...</p> : error ? (
        <div className="user-offers-feedback" role="alert">
          <NullComponent icon="🏃" title="Nie udało się pobrać ofert" text="Sprawdź połączenie i spróbuj ponownie.">
            <Button style="gradientButton" onClick={reload}>Spróbuj ponownie</Button>
          </NullComponent>
        </div>
      ) : offers.length > 0 ? offers.map((offer) => (
        <UserOfferCard offer={offer} isOwner={isOwner} key={offer.id} />
      )) : <NullOffers isOwner={isOwner} onCreate={() => setIsCreateModalOpen(true)} />}
      {isCreateModalOpen && (
        <ModalBackground closeModal={() => setIsCreateModalOpen(false)}>
          <CreateOfferModal handleAddOffer={(newOffer) => setOffers((prev) => [newOffer, ...prev])}
            closeModal={() => setIsCreateModalOpen(false)} />
        </ModalBackground>
      )}
    </div>
  );
};

export default UserOffers;
