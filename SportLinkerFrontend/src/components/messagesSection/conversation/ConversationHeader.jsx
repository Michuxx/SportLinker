import { useState } from "react";
import useDifferenceDates from "../../../hooks/useDifferenceDates";
import OnlineAvatar from "../../component-items/avatar/OnlineAvatar";
import Button from "../../component-items/button/button";
import ModalBackground from "../../component-items/modal/ModalBackground";
import ParticipantsModal from "../../participantsModal/ParticipantsModal";
import { FiRefreshCw, FiTrash2, FiUsers } from "react-icons/fi";
import "./conversation.css";

const ConversationHeader = ({ chatUser, onRefresh, onDeleteHistory, isBusy }) => {
  const [showParticipants, setShowParticipants] = useState(false);
  const days = useDifferenceDates(chatUser.lastTimeOnline);
  const status = chatUser.type === "group" ? "Rozmowa grupowa" : chatUser.isOnline ? "Online" : chatUser.lastTimeOnline ? `Ostatnio aktywny: ${days} dni temu` : "Rozmowa prywatna";
  return (
    <div className="conversation-header-wrapper">
      <div className="avatar-info-wrapper">
        <OnlineAvatar size={3} isOnline={chatUser.isOnline} image={chatUser.imageUrl} />
        <div className="user-info-header-wrapper"><h3>{chatUser.type === "group" ? "Grupa: " : ""}{chatUser.name}</h3><span>{status}</span></div>
      </div>
      <div className="conversation-btn-wrapper">
        {chatUser.participants?.length > 0 && <Button style="popupSettingsButton" Icon={<FiUsers />} onClick={() => setShowParticipants(true)}>Uczestnicy</Button>}
        {chatUser.id && <>
          <Button style="popupSettingsButton" Icon={<FiRefreshCw />} onClick={onRefresh} disabled={isBusy}>Odśwież</Button>
          <Button style="actionWarningButton" Icon={<FiTrash2 />} onClick={onDeleteHistory} disabled={isBusy}>Usuń historię</Button>
        </>}
      </div>
      {showParticipants && <ModalBackground closeModal={() => setShowParticipants(false)}><ParticipantsModal participants={chatUser.participants} /></ModalBackground>}
    </div>
  );
};
export default ConversationHeader;
