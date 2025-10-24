import "./welcomeBanner.css";
import Feature from "./Feature";
import { GoPeople } from "react-icons/go";
import { LuTrophy } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { IoPlayOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import Button from "../component-items/button/button";
import { useState } from "react";
import CreateOfferModal from "../createOfferModal/CreateOfferModal";
import ModalBackground from "../component-items/modal/ModalBackground";

const WelcomeBanner = ({ handleClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="banner">
      <div className="banner-headline">
        <h1>Znajdź swoich</h1>
        <h1>partnerów sportowych</h1>
      </div>
      <div className="headline-description">
        <p>
          Dołącz do społeczności aktywnych ludzi. Wystawiaj oferty, znajduj
          graczy i rozwijaj swoją pasję do sportu.
        </p>
      </div>
      <div className="banner-btn-section">
        <Button
          style="createOfferModalButton"
          width={40}
          Icon={<FaPlus size="24px" />}
          onClick={() => setIsModalOpen((e) => !e)}
        >
          Utwórz ofertę
        </Button>
        <Button
          style="outlineButton"
          width={50}
          Icon={<IoPlayOutline size="28px" />}
          onClick={handleClick}
        >
          Przeglądaj oferty
        </Button>
      </div>
      <div className="banner-features-wrapper">
        <Feature
          Icon={<GoPeople size="32px" color="white" />}
          title="Społeczność"
          description="Poznaj nowych ludzi z podobnymi zainteresowaniami sportowymi"
        />
        <Feature
          Icon={<LuTrophy size="32px" color="white" />}
          title="Różne poziomy"
          description="Od początkujących po zaawansowanych - każdy znajdzie coś dla siebie"
        />
        <Feature
          Icon={<IoLocationOutline size="32px" color="white" />}
          title="Lokalne spotkania"
          description="Znajdź aktywności sportowe w swojej okolicy"
        />
      </div>
      {isModalOpen && (
        <ModalBackground closeModal={() => setIsModalOpen(false)}>
          <CreateOfferModal />
        </ModalBackground>
      )}
    </div>
  );
};

export default WelcomeBanner;
