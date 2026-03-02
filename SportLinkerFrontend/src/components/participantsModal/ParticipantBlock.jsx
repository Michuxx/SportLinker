import useDifferenceDates from "../../hooks/useDifferenceDates";
import Avatar from "../component-items/avatar/Avatar";
import "./participantsModal.css";

const ParticipantBlock = ({ participant }) => {
  const formattedDate = useDifferenceDates(participant.lastTimeOnline);

  const formattedDateText =
    formattedDate !== 0
      ? `Ostatnio aktywny ${formattedDate} dni temu`
      : `Ostatnio dzisiaj online`;

  return (
    <div className="patricipant-block-wrapper">
      <div className="participant-avatar">
        <Avatar size={2} />
      </div>
      <div className="participant-block-info">
        <h5>{participant.name}</h5>
        <p>{participant.isOnline ? "Online" : formattedDateText}</p>
      </div>
    </div>
  );
};

export default ParticipantBlock;
