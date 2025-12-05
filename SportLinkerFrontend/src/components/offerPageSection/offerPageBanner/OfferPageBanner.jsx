import { useState } from "react";
import "./offerPageBanner.css";
import OfferPageTags from "./offerPageTags/OfferPageTags";
import OfferMatchCards from "./offerMatchCards/OfferMatchCards";

const OfferPageBanner = ({ offerData }) => {
  return (
    <div className="offer-banner-container">
      <OfferPageTags
        sport={offerData.sport}
        level={offerData.level}
        mode={offerData.mode}
      />
      <div className="offer-banner-headline">
        <h1>{offerData.title}</h1>
      </div>
      <div className="offer-banner-description">
        <p>{offerData.description}</p>
      </div>
      <OfferMatchCards
        date={offerData.date}
        location={offerData.location}
        people={`${offerData.currentPeople}/${offerData.maxPeople}`}
      />
    </div>
  );
};

export default OfferPageBanner;
