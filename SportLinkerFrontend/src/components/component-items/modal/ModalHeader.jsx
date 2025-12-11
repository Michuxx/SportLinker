import "./modalBackground.css";

const EditOfferModal = ({ title, description }) => {
  return (
    <div className="modal-header-wrapper">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default EditOfferModal;
