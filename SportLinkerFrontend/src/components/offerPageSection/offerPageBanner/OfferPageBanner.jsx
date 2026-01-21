import "./offerPageBanner.css";
import OfferPageTags from "./offerPageTags/OfferPageTags";
import OfferMatchCards from "./offerMatchCards/OfferMatchCards";
import Button from "../../component-items/button/button";
import { FaCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { MdOutlineAccessTime } from "react-icons/md";
import { BsDoorOpenFill } from "react-icons/bs";
import ModalBackground from "../../component-items/modal/ModalBackground";
import { useState } from "react";
import WarningModal from "../../warningModal/WarningModal";

const OfferPageBanner = ({
  offerData,
  currentPeople,
  formattedDate,
  leaveOffer,
  joinOffer,
}) => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveModalText, setLeaveModalText] = useState("");

  const openLeaveModal = () => {
    setLeaveModalText("Czy na pewno chcesz opuścić ofertę?");
    setIsLeaveModalOpen(true);
  };

  const openLeavePendingModal = () => {
    setLeaveModalText(
      "Czy na pewno chcesz zrezygnować z dołączenia do oferty?"
    );
    setIsLeaveModalOpen(true);
  };

  const buttonSelection = () => {
    if (offerData.availability === "closed") {
      return (
        <div className="offer-status-btn-wrapper">
          <Button style="offerPageRejectedButton" Icon={<MdClose size={18} />}>
            Zapisy zamknięte
          </Button>
          {offerData.status !== null && (
            <Button
              style="offerPageCancelButton"
              onClick={openLeavePendingModal}
            >
              Anuluj
            </Button>
          )}
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
          <Button style="offerPageCancelButton" onClick={openLeaveModal}>
            Opuść ofertę
          </Button>
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
          <Button style="offerPageCancelButton" onClick={openLeavePendingModal}>
            Anuluj
          </Button>
        </div>
      );
    } else {
      return (
        <Button style="offerPageJoinButton" onClick={joinOffer}>
          {offerData.mode === "public"
            ? "Dołącz"
            : "Wyślij prośbę o dołączenie"}
        </Button>
      );
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
        location={offerData.location.displayLabel}
        people={`${currentPeople}/${offerData.maxPeople}`}
      />
      {isLeaveModalOpen && (
        <ModalBackground closeModal={() => setIsLeaveModalOpen(false)}>
          <WarningModal
            headline={leaveModalText}
            confirmText="Tak, chcę"
            confirmIcon={<BsDoorOpenFill size={20} />}
            onCancel={() => setIsLeaveModalOpen(false)}
            onConfirm={leaveOffer}
          />
        </ModalBackground>
      )}
    </div>
  );
};

export default OfferPageBanner;
