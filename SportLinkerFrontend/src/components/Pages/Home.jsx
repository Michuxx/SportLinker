import Header from "../headerSection/Header";
import WelcomeBanner from "../bannerSection/welcomeBanner";
import OfferSection from "../offerSection/OfferSection";
import ModalBackground from "../component-items/modal/ModalBackground";
import AuthModal from "../authModal/AuthModal";
import { useState } from "react";

const Home = () => {
  const handleScrollToOffers = () => {
    document.getElementById("offers")?.scrollIntoView({ behavior: "smooth" });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="container">
      <Header openModal={setIsModalOpen} />
      <WelcomeBanner handleClick={handleScrollToOffers} />
      <OfferSection />
      {isModalOpen && (
        <ModalBackground closeModal={() => setIsModalOpen(false)}>
          <AuthModal />
        </ModalBackground>
      )}
    </div>
  );
};

export default Home;
