import OfferActionPanel from "./offerActionPanel/OfferActionPanel";
import "./offerControlPanel.css";
import OfferInfoPanel from "./offerInfoPanel/OfferInfoPanel";

const OfferControlPanel = ({
  creationDate,
  status,
  openSlots,
  openEditModal,
  openAddPeopleModal,
}) => {
  return (
    <div className="offer-control-panel-container">
      <OfferActionPanel
        openEditModal={openEditModal}
        openAddPeopleModal={openAddPeopleModal}
      />
      <OfferInfoPanel
        creationDate={creationDate}
        status={status}
        openSlots={openSlots}
      />
    </div>
  );
};

export default OfferControlPanel;
