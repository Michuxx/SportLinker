import ModalHeader from "../component-items/modal/ModalHeader";
import NullComponent from "../component-items/nullComponent/NullComponent";
import AddPeopleCard from "./addPeopleCard/AddPeopleCard";
import "./addPeopleModal.css";
import NullRequest from "./nullRequest/NullRequest";
import { PiSmileySadBold } from "react-icons/pi";

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
          <NullComponent icon={<PiSmileySadBold size={50} />} title="Brak zapytań" text="Zerknij później"/>
        )}
      </div>
    </div>
  );
};

export default AddPeopleModal;
