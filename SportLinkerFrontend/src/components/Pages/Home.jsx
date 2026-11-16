import Header from "../headerSection/Header";
import WelcomeBanner from "../bannerSection/welcomeBanner";
import OfferSection from "../offerSection/OfferSection";
import ModalBackground from "../component-items/modal/ModalBackground";
import AuthModal from "../authModal/AuthModal";
import { useState } from "react";
import CreateOfferModal from "../createOfferModal/CreateOfferModal";
import useOfferSearch from "../../hooks/useOfferSearch";

const Home = () => {
  const search = useOfferSearch();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateOfferModalOpen, setIsCreateOfferModalOpen] = useState(false);
  return (
    <div className="container">
      <Header openModal={setIsAuthModalOpen} />
      <WelcomeBanner handleClick={() => document.getElementById("offers")?.scrollIntoView({ behavior: "smooth" })} showOfferModal={() => setIsCreateOfferModalOpen(true)} />
      <OfferSection search={search} />
      {isAuthModalOpen && <ModalBackground closeModal={() => setIsAuthModalOpen(false)}><AuthModal closeModal={() => setIsAuthModalOpen(false)} /></ModalBackground>}
      {isCreateOfferModalOpen && <ModalBackground closeModal={() => setIsCreateOfferModalOpen(false)}><CreateOfferModal handleAddOffer={search.addOffer} closeModal={() => setIsCreateOfferModalOpen(false)} /></ModalBackground>}
    </div>
  );
};
export default Home;
