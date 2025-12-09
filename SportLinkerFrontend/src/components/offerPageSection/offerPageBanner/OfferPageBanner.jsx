import "./offerPageBanner.css";
import OfferPageTags from "./offerPageTags/OfferPageTags";
import OfferMatchCards from "./offerMatchCards/OfferMatchCards";
import Button from "../../component-items/button/button";
import { FaCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { MdOutlineAccessTime } from "react-icons/md";

const OfferPageBanner = ({ offerData, currentPeople }) => {
  const buttonSelection = () => {
    if (offerData.availability === "closed") {
      return (
        <Button style="offerPageRejectedButton" Icon={<MdClose size={18} />}>
          Zapisy zamknięte
        </Button>
      );
    } else if (offerData.status === "rejected") {
      return (
        <Button style="offerPageRejectedButton" Icon={<MdClose size={18} />}>
          Odrzucono
        </Button>
      );
    } else if (offerData.status === "accepted") {
      return (
        <Button style="offerPageJoinedButton" Icon={<FaCheck size={18} />}>
          Dołączono
        </Button>
      );
    } else if (offerData.status === "pending") {
      return (
        <Button
          style="offerPagePendingButton"
          Icon={<MdOutlineAccessTime size={18} />}
        >
          Oczekuje na akceptacje
        </Button>
      );
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
