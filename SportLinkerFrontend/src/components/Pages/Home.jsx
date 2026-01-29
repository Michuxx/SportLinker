import Header from "../headerSection/Header";
import WelcomeBanner from "../bannerSection/welcomeBanner";
import OfferSection from "../offerSection/OfferSection";
import ModalBackground from "../component-items/modal/ModalBackground";
import AuthModal from "../authModal/AuthModal";
import { useState } from "react";
import CreateOfferModal from "../createOfferModal/CreateOfferModal";

const Home = () => {
  const handleScrollToOffers = () => {
    document.getElementById("offers")?.scrollIntoView({ behavior: "smooth" });
  };
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [isCreateOfferModalOpen, setIsCreateOfferModalOpen] = useState(false);
  return (
    <div className="container">
      <Header openModal={setIsAuthModalOpen} />
      <WelcomeBanner
        handleClick={handleScrollToOffers}
        showOfferModal={() => setIsCreateOfferModalOpen(true)}
      />
      <OfferSection />
      {isAuthModalOpen && (
        <ModalBackground closeModal={() => setIsAuthModalOpen(false)}>
          <AuthModal />
        </ModalBackground>
      )}
      {isCreateOfferModalOpen && (
        <ModalBackground closeModal={() => setIsCreateOfferModalOpen(false)}>
          <CreateOfferModal />
        </ModalBackground>
      )}
    </div>
  );
};

export default Home;
