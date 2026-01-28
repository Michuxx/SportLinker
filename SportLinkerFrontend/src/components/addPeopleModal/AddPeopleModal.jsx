import ModalHeader from "../component-items/modal/ModalHeader";
import AddPeopleCard from "./addPeopleCard/AddPeopleCard";
import "./addPeopleModal.css";
import NullRequest from "./nullRequest/NullRequest";

const AddPeopleModal = ({ requests, openSlots }) => {
  return (
    <div className="add-people-container">
      <ModalHeader title="Prośby o dołączenie do oferty" />
      <div className="request-people-wrapper">
        {requests && requests.length > 0 ? (
          requests.map((request) => (
            <AddPeopleCard
              request={request}
              openSlots={openSlots}
              key={request.id}
            />
          ))
        ) : (
          <NullRequest />
        )}
      </div>
    </div>
  );
};

export default AddPeopleModal;
