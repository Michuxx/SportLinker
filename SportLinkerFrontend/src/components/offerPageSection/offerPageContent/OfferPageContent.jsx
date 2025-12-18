import OfferAttendees from "./offerAttendees/OfferAttendees";
import OfferControlPanel from "./offerControlPanel/OfferControlPanel";
import "./offerPageContent.css";

const OfferPageContent = ({
  offerData,
  openSlots,
  openEditModal,
  kickPlayer,
}) => {
  return (
    <div className="offer-page-content-container">
      <OfferAttendees
        author={offerData.author}
        members={offerData.members}
        offerAuthorId={offerData.authorId}
        kickPlayer={kickPlayer}
      />
      <OfferControlPanel
        creationDate={offerData.creationDate}
        status={offerData.availability}
        openSlots={openSlots}
        openEditModal={openEditModal}
      />
    </div>
  );
};

export default OfferPageContent;
