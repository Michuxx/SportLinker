import OfferInfoBlock from "./offerInfoBlock";
import "./offerInfoPanel.css";

const OfferInfoPanel = ({ creationDate, status, openSlots }) => {
  return (
    <div className="offer-info-panel-container">
      <h3>Informacje</h3>
      <div className="offer-info-block-wrapper">
        <OfferInfoBlock title="Utworzono:" value={creationDate} />
        <OfferInfoBlock title="Status:" value={status} />
        <OfferInfoBlock title="Wolne miejsca:" value={openSlots} />
      </div>
    </div>
  );
};

export default OfferInfoPanel;
