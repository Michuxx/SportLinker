import { CiWarning } from "react-icons/ci";
import "./deleteOfferModal.css";
import Button from "../component-items/button/button";
import { MdClose } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

const DeleteOfferModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="delete-offer-modal-wrapper">
      <div className="delete-offer-icon">
        <CiWarning size={96} color="rgb(220 38 38)" />
      </div>
      <h1>Czy na pewno chcesz usunąć tę ofertę?</h1>
      <p>ten proces jest nieodwracalny</p>
      <div className="delete-offer-btn-section">
        <Button style="classicRedButton" onClick={() => {
          onConfirm(); 
          onCancel();
          }} Icon={<FaRegTrashAlt size={20} />} >
          Usuń
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

export default DeleteOfferModal;
