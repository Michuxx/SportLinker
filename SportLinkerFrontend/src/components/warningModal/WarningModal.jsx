import { CiWarning } from "react-icons/ci";
import "./warningModal.css";
import Button from "../component-items/button/button";
import { MdClose } from "react-icons/md";

const WarningModal = ({
  onConfirm,
  onCancel,
  headline,
  paragraph,
  confirmText,
  confirmIcon,
  mainIcon,
}) => {
  return (
    <div className="warning-modal-wrapper">
      <div className="warning-icon">
        {mainIcon ? (
          { mainIcon }
        ) : (
          <CiWarning size={96} color="rgb(220 38 38)" />
        )}
      </div>
      <h1>{headline}</h1>
      <p>{paragraph}</p>
      <div className="warning-btn-section">
        <Button
          style="classicRedButton"
          onClick={() => {
            onConfirm();
            onCancel();
          }}
          Icon={confirmIcon}
        >
          {confirmText}
        </Button>
        <Button
          onClick={onCancel}
          style="classicGreyButton"
          Icon={<MdClose size={20} />}
        >
          Anuluj
        </Button>
      </div>
    </div>
  );
};

export default WarningModal;
