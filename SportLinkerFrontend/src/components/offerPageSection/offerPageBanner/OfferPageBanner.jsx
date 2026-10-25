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
  joinOffer,
  isJoining = false,
  isSaving = false,
  isMember = false,
  isAuthor = false,
}) => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveModalText, setLeaveModalText] = useState("");
  const scrollRef = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

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
    const status = isMember ? "accepted" : offerData.status;
    if (isAuthor) {
      return <Button style="offerPageJoinedButton" disabled>Organizator</Button>;
    }
    if (isJoining) {
      return (
        <Button style="offerPageJoinButton" disabled>
          {offerData.mode === "private" ? "Wysyłanie prośby..." : "Dołączanie..."}
        </Button>
      );
    }
    if ((offerData.availability === "Unavailable" || currentPeople >= offerData.maxPeople)
      && status !== "accepted" && status !== "pending") {
      return (
        <div className="offer-status-btn-wrapper">
          <Button style="offerPageRejectedButton" Icon={<MdClose size={18} />}>
            Zapisy zamknięte
          </Button>
          {status !== null && (
            <Button
              style="offerPageCancelButton"
              onClick={openLeavePendingModal}
            >
              Anuluj
            </Button>
          )}
        </div>
      );
    } else if (status === "rejected") {
      return (
        <Button style="offerPageRejectedButton" Icon={<MdClose size={18} />}>
          Odrzucono
        </Button>
      );
    } else if (status === "accepted") {
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
    } else if (status === "pending") {
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
        <Button style="offerPageJoinButton" onClick={joinOffer} disabled={isSaving}>
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
