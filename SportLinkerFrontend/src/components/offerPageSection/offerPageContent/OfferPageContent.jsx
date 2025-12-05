import OfferAttendees from "./offerAttendees/OfferAttendees";
import OfferControlPanel from "./offerControlPanel/OfferControlPanel";
import "./offerPageContent.css";

const OfferPageContent = ({ offerData }) => {
  return (
    <div className="offer-page-content-container">
      <OfferAttendees />
      <OfferControlPanel />
    </div>
  );
};

export default OfferPageContent;
