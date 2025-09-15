import "./App.css";
import Header from "./components/headerSection/Header";
import WelcomeBanner from "./components/bannerSection/welcomeBanner";
import OfferSection from "./components/offerSection/OfferSection";
import ModalBackground from "./components/component-items/modal/ModalBackground";
import AuthModal from "./components/authModal/AuthModal";
import { useState } from "react";

function App() {
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
}

export default App;
