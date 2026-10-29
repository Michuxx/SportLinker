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
  isAuthor = false,
  isBusy = false,
}) => {
  return (
    <div className="offer-page-content-container">
      <div className="offer-page-content-wrapper">
        <OfferAttendees
          author={offerData.author}
          members={offerData.members}
          offerAuthorId={offerData.authorId}
          kickPlayer={kickPlayer}
          isAuthor={isAuthor}
          isBusy={isBusy}
        />
        <OfferControlPanel
          creationDate={offerData.creationDate}
          status={offerData.availability}
          openSlots={openSlots}
          openEditModal={openEditModal}
          openAddPeopleModal={openAddPeopleModal}
          isAuthor={isAuthor}
          isBusy={isBusy}
        />
      </div>
      <OfferMapLocation location={offerData.location} />
    </div>
  );
};

export default OfferPageContent;
