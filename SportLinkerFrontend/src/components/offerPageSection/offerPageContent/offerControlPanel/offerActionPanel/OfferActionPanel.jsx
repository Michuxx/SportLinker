import "./offerActionPanel.css";
import Button from "../../../../component-items/button/button";
import { FiMessageCircle } from "react-icons/fi";
import { BsShare } from "react-icons/bs";
import { FiFlag } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { CgUserAdd } from "react-icons/cg";

const OfferActionPanel = ({ openEditModal, openAddPeopleModal, isAuthor = false, isBusy = false }) => {
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
        {isAuthor && (
          <>
            <Button
              style="actionSettingsButton"
              width={100}
              Icon={<FiSettings size={20} />}
              onClick={openEditModal}
              disabled={isBusy}
            >
              Edytuj ofertę
            </Button>
            <Button
              style="actionAddPeopleButton"
              width={100}
              Icon={<CgUserAdd size={20} />}
              onClick={openAddPeopleModal}
              disabled={isBusy}
            >
              Prośby o dołączenie
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default OfferActionPanel;
