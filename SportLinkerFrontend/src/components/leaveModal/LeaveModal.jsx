import { CiWarning } from "react-icons/ci";
import "./leaveModal.css";
import Button from "../component-items/button/button";
import { MdClose } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

const LeaveModal = ({ onConfirm, onCancel, text }) => {
  return (
    <div className="delete-offer-modal-wrapper">
      <div className="delete-offer-icon">
        <CiWarning size={96} color="rgb(220 38 38)" />
      </div>
      <h1>{text}</h1>
      <div className="delete-offer-btn-section">
        <Button
          style="classicRedButton"
          onClick={() => {
            onConfirm();
            onCancel();
          }}
        >
          Tak
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

export default LeaveModal;
