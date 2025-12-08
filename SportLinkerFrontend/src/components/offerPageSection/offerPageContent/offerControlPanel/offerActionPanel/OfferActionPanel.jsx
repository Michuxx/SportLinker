import "./offerActionPanel.css";
import Button from "../../../../component-items/button/button";

const OfferActionPanel = () => {
  return (
    <div className="offer-action-panel-container">
      <h3>Akcje</h3>
      <Button>Wyślij wiadomość</Button>
      <Button>Udostępnij</Button>
      <Button>Zgłoś</Button>
    </div>
  );
};

export default OfferActionPanel;
