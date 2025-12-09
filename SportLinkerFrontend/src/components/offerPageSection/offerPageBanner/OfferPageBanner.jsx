import "./offerPageBanner.css";
import OfferPageTags from "./offerPageTags/OfferPageTags";
import OfferMatchCards from "./offerMatchCards/OfferMatchCards";
import Button from "../../component-items/button/button";

const OfferPageBanner = ({ offerData, currentPeople }) => {
  const buttonSelection = () => {
    if (offerData.status === "rejected") {
      return <Button>Odrzucono</Button>;
    } else if (offerData.status === "accepted") {
      return <Button style="offerPageJoinedButton">Dołączono</Button>;
    } else if (offerData.status === "pending") {
      return <Button style="">Oczekuje na akceptacje</Button>;
    } else if (offerData.availability === "closed") {
      return <Button style="">Zamknięto dołączanie</Button>;
    } else {
      return <Button style="offerPageJoinButton">Dołącz</Button>;
    }
  };

  return (
    <div className="offer-banner-container">
      <div className="offer-btn-tag-wrapper">
        <OfferPageTags
          sport={offerData.sport}
          level={offerData.level}
          mode={offerData.mode}
        />
        <div className="offer-join-btn">{buttonSelection()}</div>
      </div>
      <div className="offer-banner-headline">
        <h1>{offerData.title}</h1>
      </div>
      <div className="offer-banner-description">
        <p>{offerData.description}</p>
      </div>
      <OfferMatchCards
        date={offerData.date}
        location={offerData.location}
        people={`${currentPeople}/${offerData.maxPeople}`}
      />
    </div>
  );
};

export default OfferPageBanner;
