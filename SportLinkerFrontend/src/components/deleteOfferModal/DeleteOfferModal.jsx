import { CiWarning } from "react-icons/ci";
import "./deleteOfferModal.css";
import Button from "../component-items/button/button";

const DeleteOfferModal = ({ id, onConfirm, onCancel }) => {
  return (
    <div className="delete-offer-modal-wrapper">
      <CiWarning />
      <h1>Czy na pewno chcesz usunąć tę ofertę?</h1>
      <p>ten proces jest nieodwracalny</p>
      <div className="delete-offer-btn-section">
        <Button>Usuń</Button>
        <Button onClick={onCancel}>Anuluj</Button>
      </div>
    </div>
  );
};

export default DeleteOfferModal;
