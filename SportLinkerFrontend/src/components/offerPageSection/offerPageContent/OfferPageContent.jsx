import OfferAttendees from "./offerAttendees/OfferAttendees";
import OfferControlPanel from "./offerControlPanel/OfferControlPanel";
import OfferMapLocation from "./offerMapLocation/OfferMapLocation";
import "./offerPageContent.css";

const OfferPageContent = ({
  offerData,
  openSlots,
  openEditModal,
  openAddPeopleModal,
  kickPlayer,
}) => {
  return (
    <div className="offer-page-content-container">
      <div className="offer-page-content-wrapper">
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
          openAddPeopleModal={openAddPeopleModal}
        />
      </div>
      <OfferMapLocation location={offerData.location} />
    </div>
  );
};

export default OfferPageContent;
