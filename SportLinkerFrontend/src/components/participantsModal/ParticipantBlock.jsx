import useLastActive from "../../hooks/useLastActive";
import OnlineAvatar from "../component-items/avatar/OnlineAvatar";
import "./participantsModal.css";

const ParticipantBlock = ({ participant }) => {
  const lastActive = useLastActive(participant.lastTimeOnline);

  return (
    <div className="patricipant-block-wrapper">
      <div className="participant-avatar">
        <OnlineAvatar size={2.5} isOnline={participant.isOnline} />
      </div>
      <div className="participant-block-info">
        <h5>{participant.name}</h5>
        <p>{participant.isOnline ? "Online" : lastActive ?? "Brak danych o aktywności"}</p>
      </div>
    </div>
  );
};

export default ParticipantBlock;
