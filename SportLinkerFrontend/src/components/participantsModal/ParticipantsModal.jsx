import ModalHeader from "../component-items/modal/ModalHeader";
import ParticipantBlock from "./ParticipantBlock";
import "./participantsModal.css";

const ParticipantsModal = ({ participants }) => {
  return (
    <div className="patricipants-modal-wrapper">
      <ModalHeader title={"Uczestnicy konwersacji"} />
      <div className="participants-wrapper">
        {participants.map((participant) => (
          <ParticipantBlock participant={participant} key={participant.id} />
        ))}
      </div>
    </div>
  );
};

export default ParticipantsModal;
