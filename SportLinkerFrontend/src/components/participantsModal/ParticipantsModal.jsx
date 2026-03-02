import ModalHeader from "../component-items/modal/ModalHeader";
import ParticipantBlock from "./ParticipantBlock";
import "./participantsModal.css";

const ParticipantsModal = ({ participants }) => {
  return (
    <div className="patricipants-modal-wrapper">
      <ModalHeader title={"Uczestnicy konwersacji"} />
      {participants.map((participant) => (
        <ParticipantBlock participant={participant} />
      ))}
    </div>
  );
};

export default ParticipantsModal;
