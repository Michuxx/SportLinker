import Header from "../headerSection/Header";
import WelcomeBanner from "../bannerSection/welcomeBanner";
import OfferSection from "../offerSection/OfferSection";
import ModalBackground from "../component-items/modal/ModalBackground";
import AuthModal from "../authModal/AuthModal";
import { useState } from "react";
import CreateOfferModal from "../createOfferModal/CreateOfferModal";

const Home = () => {
  const [userOffers, setUserOffers] = useState([
    {
      id: "1",
      title: "Poszukuję partnera do tenisa",
      sport: "Tenis",
      level: "intermediate",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "2025-01-20T18:00",
      location: {
        long: 19.028552141007275,
        lat: 50.25532955,
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 2,
      author: "Anna Kowalska",
      mode: "public",
    },
    {
      id: "2",
      title: "Poszukuję partnera do tenisa",
      sport: "Badminton",
      level: "intermediate",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "2025-01-20T18:00",
      location: {
        long: 19.028552141007275,
        lat: 50.25532955,
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 2,
      author: "Anna Kowalska",
      mode: "public",
    },
    {
      id: "3",
      title: "Poszukuję partnera do tenisa",
      sport: "Tenis",
      level: "intermediate",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "2025-01-20T18:00",
      location: {
        long: 19.028552141007275,
        lat: 50.25532955,
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 2,
      author: "Anna Kowalska",
      mode: "public",
    },
    {
      id: "4",
      title: "Poszukuję partnera do tenisa",
      sport: "Tenis",
      level: "intermediate",
      description:
        "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
      date: "2025-01-20T18:00",
      location: {
        long: 19.028552141007275,
        lat: 50.25532955,
        country: "Poland",
        name: "Warsaw",
        state: "Masovian Voivodeship",
        displayLabel: "Warsaw, Masovian Voivodeship",
      },
      currentPeople: 1,
      maxPeople: 2,
      author: "Anna Kowalska",
      mode: "public",
    },
  ]);

  const handleScrollToOffers = () => {
    document.getElementById("offers")?.scrollIntoView({ behavior: "smooth" });
  };
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [isCreateOfferModalOpen, setIsCreateOfferModalOpen] = useState(false);
  const handleAddOffer = (offerData) => {
    setUserOffers((prev) => [...prev, offerData]);
  };

  return (
    <div className="container">
      <Header openModal={setIsAuthModalOpen} />
      <WelcomeBanner
        handleClick={handleScrollToOffers}
        showOfferModal={() => setIsCreateOfferModalOpen(true)}
      />
      <OfferSection userOffers={userOffers} />
      {isAuthModalOpen && (
        <ModalBackground closeModal={() => setIsAuthModalOpen(false)}>
          <AuthModal />
        </ModalBackground>
      )}
      {isCreateOfferModalOpen && (
        <ModalBackground closeModal={() => setIsCreateOfferModalOpen(false)}>
          <CreateOfferModal handleAddOffer={handleAddOffer} />
        </ModalBackground>
      )}
    </div>
  );
};

export default Home;
