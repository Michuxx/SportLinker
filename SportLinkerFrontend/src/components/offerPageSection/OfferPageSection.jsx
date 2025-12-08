import { useEffect, useState } from "react";
import OfferPageBanner from "./offerPageBanner/OfferPageBanner";
import "./offerPageSection.css";
import OfferPageContent from "./offerPageContent/OfferPageContent";

const OfferPageSection = () => {
  const [offerData, setOfferData] = useState({
    id: 1,
    title: "Poszukuję partnera do tenisa",
    sport: "Tenis",
    level: "expert",
    description:
      "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
    date: "pon., 20.01, 18:00",
    creationDate: "04.12.2025",
    location: "Warszawa, Mokotów",
    maxPeople: 4,
    availability: "closed",
    mode: "private",
    authorId: 1,
    author: {
      id: 1,
      name: "Macius",
      joinDate: "02.12.2025",
    },
    members: [
      {
        id: 2,
        name: "Kuba",
        joinDate: "02.12.2025",
      },
      {
        id: 3,
        name: "Janusz",
        joinDate: "02.12.2025",
      },
      {
        id: 4,
        name: "Martusiem",
        joinDate: "02.12.2025",
      },
    ],
  });

  const [currentPeople, setCurrentPeople] = useState();
  const [openSlots, setOpenSlots] = useState();

  useEffect(() => {
    let counter = 1;
    counter += offerData.members.length;
    setCurrentPeople(counter);
    setOpenSlots(offerData.maxPeople - counter);
  }, [offerData]);

  return (
    <div className="offer-page-section-container">
      <OfferPageBanner offerData={offerData} currentPeople={currentPeople} />
      <OfferPageContent offerData={offerData} openSlots={openSlots} />
    </div>
  );
};

export default OfferPageSection;
