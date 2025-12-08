import OfferInfoBlock from "./offerInfoBlock";
import "./offerInfoPanel.css";

const OfferInfoPanel = ({ creationDate, status, openSlots }) => {
  let statusCss;
  let statusText;

  switch (status) {
    case "open":
      statusCss = "offer-open-status";
      statusText = "Dostępna";
      break;
    case "closed":
      statusCss = "offer-closed-status";
      statusText = "Zamknięta";
  }

  return (
    <div className="offer-info-panel-container">
      <h3>Informacje</h3>
      <div className="offer-info-block-wrapper">
        <OfferInfoBlock title="Utworzono:" value={creationDate} />
        <OfferInfoBlock
          title="Status:"
          value={statusText}
          additionalCss={statusCss}
        />
        <OfferInfoBlock title="Wolne miejsca:" value={openSlots} />
      </div>
    </div>
  );
};

export default OfferInfoPanel;
