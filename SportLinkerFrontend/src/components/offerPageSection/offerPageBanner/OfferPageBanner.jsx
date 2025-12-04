import { useState } from "react";
import "./offerPageBanner.css";
import OfferPageTags from "./offerPageTags/OfferPageTags";

const OfferPageBanner = () => {
  const [offerData, setOfferData] = useState({
    id: 1,
    title: "Poszukuję partnera do tenisa",
    sport: "Tenis",
    level: "any",
    description:
      "Szukam osoby do regularnego grania w tenisa. Poziom średniozaawansowany, gra 2-3 razy w tygodniu.",
    date: "pon., 20.01, 18:00",
    creationDate: "04.12.2025",
    location: "Warszawa, Mokotów",
    currentPeople: 1,
    maxPeople: 2,
    availability: "open",
    mode: "private",
  });

  return (
    <div className="offer-banner-container">
      <OfferPageTags
        sport={offerData.sport}
        level={offerData.level}
        mode={offerData.mode}
      />
    </div>
  );
};

export default OfferPageBanner;
