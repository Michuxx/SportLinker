import OfferInfoBlock from "./OfferInfoBlock";
import "./offerInfoPanel.css";
import useDateFormat from "../../../../../hooks/useDateFormat";

const OfferInfoPanel = ({ creationDate, status, openSlots }) => {
  const formattedCreationDate = useDateFormat(creationDate);
  let statusCss;
  let statusText;

  switch (status) {
    case "Available":
      statusCss = "offer-open-status";
      statusText = "Dostępna";
      break;
    case "Unavailable":
      statusCss = "offer-closed-status";
      statusText = "Zamknięta";
  }

  return (
    <div className="offer-info-panel-container">
      <h3>Informacje</h3>
      <div className="offer-info-block-wrapper">
        <OfferInfoBlock title="Utworzono:" value={formattedCreationDate?.date || ""} />
        <OfferInfoBlock
          title="Dostępność:"
          value={statusText}
          additionalCss={statusCss}
        />
        <OfferInfoBlock title="Wolne miejsca:" value={openSlots} />
      </div>
    </div>
  );
};

export default OfferInfoPanel;
