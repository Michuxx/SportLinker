import "./offerActionPanel.css";
import Button from "../../../../component-items/button/button";
import { FiMessageCircle } from "react-icons/fi";
import { BsShare } from "react-icons/bs";
import { FiFlag } from "react-icons/fi";

const OfferActionPanel = () => {
  return (
    <div className="offer-action-panel-container">
      <h3>Akcje</h3>
      <div className="action-btn-stag">
        <Button
          style="actionButton"
          width={100}
          Icon={<FiMessageCircle size={20} />}
        >
          Wyślij wiadomość
        </Button>
        <Button style="actionButton" width={100} Icon={<BsShare size={20} />}>
          Udostępnij
        </Button>
        <Button
          style="actionWarningButton"
          width={100}
          Icon={<FiFlag size={20} />}
        >
          Zgłoś
        </Button>
      </div>
    </div>
  );
};

export default OfferActionPanel;
