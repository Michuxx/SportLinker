import "./offerPageBanner.css";
import OfferPageTags from "./offerPageTags/OfferPageTags";
import OfferMatchCards from "./offerMatchCards/OfferMatchCards";
import Button from "../../component-items/button/button";
import { FaCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { MdOutlineAccessTime } from "react-icons/md";
import { BsDoorOpenFill } from "react-icons/bs";
import ModalBackground from "../../component-items/modal/ModalBackground";
import { useEffect, useRef, useState } from "react";
import WarningModal from "../../warningModal/WarningModal";

const OfferPageBanner = ({
  offerData,
  currentPeople,
  formattedDate,
  leaveOffer,
  cancelOfferRequest,
  joinOffer,
  isJoining = false,
  isSaving = false,
  isMember = false,
  isAuthor = false,
  isBusy = false,
}) => {
  const [exitAction, setExitAction] = useState(null);
  const scrollRef = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  const openLeaveModal = () => {
    setExitAction("leave");
  };

  const openLeavePendingModal = () => {
    setExitAction("cancel");
  };

  const buttonSelection = () => {
    const status = isMember ? "accepted" : offerData.status;
    if (isAuthor) {
      return (
        <div className="offer-status-btn-wrapper">
          <Button style="offerPageJoinedButton" disabled>Organizator</Button>
          <Button style="offerPageCancelButton" onClick={openLeaveModal} disabled={isBusy}>
            Opuść ofertę
          </Button>
        </div>
      );
    }
    if (isJoining) {
      return (
        <Button style="offerPageJoinButton" disabled>
          {offerData.mode === "private" ? "Wysyłanie prośby..." : "Dołączanie..."}
        </Button>
      );
    }
    if (status === "accepted") {
      return (
        <div className="offer-status-btn-wrapper">
          <Button style="offerPageJoinedButton" Icon={<FaCheck size={18} />} disabled>
            Dołączono
          </Button>
          <Button style="offerPageCancelButton" onClick={openLeaveModal} disabled={isBusy}>
            Opuść ofertę
          </Button>
        </div>
      );
    } else if (status === "rejected") {
      return (
        <div className="offer-status-btn-wrapper">
          <Button style="offerPageRejectedButton" Icon={<MdClose size={18} />} disabled>
            Odrzucono
          </Button>
          <Button style="offerPageCancelButton" onClick={openLeavePendingModal} disabled={isBusy}>
            Anuluj prośbę
          </Button>
        </div>
      );
    } else if (status === "pending") {
      return (
        <div className="offer-status-btn-wrapper">
          <Button
            style="offerPagePendingButton"
            Icon={<MdOutlineAccessTime size={18} />}
          >
            Oczekuje na akceptacje
          </Button>
          <Button style="offerPageCancelButton" onClick={openLeavePendingModal} disabled={isBusy}>
            Anuluj
          </Button>
        </div>
      );
    } else if (offerData.availability === "Unavailable" || currentPeople >= offerData.maxPeople) {
      return (
        <Button style="offerPageRejectedButton" Icon={<MdClose size={18} />} disabled>
          Zapisy zamknięte
        </Button>
      );
    } else {
      return (
        <Button style="offerPageJoinButton" onClick={joinOffer} disabled={isSaving || isBusy}>
          {offerData.mode === "public"
            ? "Dołącz"
            : "Wyślij prośbę o dołączenie"}
        </Button>
      );
    }
  };

  return (
    <div className="offer-banner-container" ref={scrollRef}>
      <div className="offer-btn-tag-wrapper">
        <OfferPageTags
          sport={offerData.sportName}
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
      {exitAction && (
        <ModalBackground closeModal={() => setExitAction(null)}>
          <WarningModal
            headline={exitAction === "leave"
              ? "Czy na pewno chcesz opuścić ofertę?"
              : "Czy na pewno chcesz anulować prośbę o dołączenie?"}
            paragraph={exitAction === "leave" && isAuthor
              ? "Organizacja oferty zostanie przekazana innemu uczestnikowi. Jeśli nie ma innych uczestników, oferta zostanie usunięta."
              : undefined}
            confirmText="Tak, chcę"
            confirmIcon={<BsDoorOpenFill size={20} />}
            onCancel={() => setExitAction(null)}
            onConfirm={() => {
              if (isBusy) return;
              if (exitAction === "leave") leaveOffer();
              else cancelOfferRequest();
            }}
          />
        </ModalBackground>
      )}
    </div>
  );
};

export default OfferPageBanner;
