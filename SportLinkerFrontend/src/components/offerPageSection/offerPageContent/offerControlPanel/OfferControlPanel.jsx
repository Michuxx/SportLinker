import OfferActionPanel from "./offerActionPanel/OfferActionPanel";
import "./offerControlPanel.css";
import OfferInfoPanel from "./offerInfoPanel/OfferInfoPanel";

const OfferControlPanel = ({ creationDate, status, currentPeople }) => {
  return (
    <div className="offer-control-panel-container">
      <OfferActionPanel />
      <OfferInfoPanel
        creationDate={creationDate}
        status={status}
        currentPeople={currentPeople}
      />
    </div>
  );
};

export default OfferControlPanel;
