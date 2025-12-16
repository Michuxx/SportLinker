import "./offerPageBanner.css";
import OfferPageTags from "./offerPageTags/OfferPageTags";
import OfferMatchCards from "./offerMatchCards/OfferMatchCards";
import Button from "../../component-items/button/button";
import { FaCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { MdOutlineAccessTime } from "react-icons/md";

const OfferPageBanner = ({ offerData, currentPeople, formattedDate }) => {
  const buttonSelection = () => {
    if (offerData.availability === "closed") {
      return (
        <div className="offer-status-btn-wrapper">
          <Button style="offerPageRejectedButton" Icon={<MdClose size={18} />}>
            Zapisy zamknięte
          </Button>
          <Button style="offerPageCancelButton">Anuluj</Button>
        </div>
      );
    } else if (offerData.status === "rejected") {
      return (
        <Button style="offerPageRejectedButton" Icon={<MdClose size={18} />}>
          Odrzucono
        </Button>
      );
    } else if (offerData.status === "accepted") {
      return (
        <div className="offer-status-btn-wrapper">
          <Button style="offerPageJoinedButton" Icon={<FaCheck size={18} />}>
            Dołączono
          </Button>
          <Button style="offerPageCancelButton">Opuść ofertę</Button>
        </div>
      );
    } else if (offerData.status === "pending") {
      return (
        <div className="offer-status-btn-wrapper">
          <Button
            style="offerPagePendingButton"
            Icon={<MdOutlineAccessTime size={18} />}
          >
            Oczekuje na akceptacje
          </Button>
          <Button style="offerPageCancelButton">Anuluj</Button>
        </div>
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
        date={formattedDate}
        location={offerData.location}
        people={`${currentPeople}/${offerData.maxPeople}`}
      />
    </div>
  );
};

export default OfferPageBanner;
