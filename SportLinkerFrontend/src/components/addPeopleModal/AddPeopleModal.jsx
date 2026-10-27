import ModalHeader from "../component-items/modal/ModalHeader";
import NullComponent from "../component-items/nullComponent/NullComponent";
import AddPeopleCard from "./addPeopleCard/AddPeopleCard";
import "./addPeopleModal.css";
import { PiSmileySadBold } from "react-icons/pi";

const AddPeopleModal = ({
  requests,
  openSlots,
  rejectPlayerRequest,
  acceptPlayerRequest,
  isLoading = false,
  error = null,
  retryRequests,
}) => {
  return (
    <div className="add-people-container">
      <ModalHeader title="Prośby o dołączenie do oferty" />
      <div className="request-people-wrapper">
        {isLoading ? (
          <p role="status">Ładowanie próśb o dołączenie...</p>
        ) : error ? (
          <div role="alert">
            <p>{error}</p>
            <button type="button" onClick={retryRequests}>Spróbuj ponownie</button>
          </div>
        ) : requests && requests.length > 0 ? (
          requests.map((request) => (
            <AddPeopleCard
              request={request}
              openSlots={openSlots}
              key={request.id}
              rejectPlayerRequest={rejectPlayerRequest}
              acceptPlayerRequest={acceptPlayerRequest}
            />
          ))
        ) : (
          <NullComponent
            icon={<PiSmileySadBold size={40} />}
            title="Brak zapytań"
            text="Zerknij później"
          />
        )}
      </div>
    </div>
  );
};

export default AddPeopleModal;
