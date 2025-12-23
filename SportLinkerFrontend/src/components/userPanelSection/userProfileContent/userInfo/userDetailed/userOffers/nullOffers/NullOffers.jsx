import { useState } from "react";
import ModalBackground from "../../../../../../component-items/modal/ModalBackground";
import NullComponent from "../../../../../../component-items/nullComponent/NullComponent";
import CreateOfferModal from "../../../../../../createOfferModal/CreateOfferModal";
import "./nullOffers.css";
import Button from "../../../../../../component-items/button/button";

const NullOffers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="null-offers-wrapper">
      <NullComponent
        title="Brak ofert"
        text="Nie utworzyłeś jeszcze żadnych ofert sportowych"
        icon="🏃‍♂️"
      >
        <Button
          style="gradientButton"
          width={20}
          onClick={(e) => setIsModalOpen((e) => !e)}
        >
          Utwórz ofertę
        </Button>
      </NullComponent>
      {isModalOpen && (
        <ModalBackground closeModal={() => setIsModalOpen(false)}>
          <CreateOfferModal />
        </ModalBackground>
      )}
    </div>
  );
};

export default NullOffers;
