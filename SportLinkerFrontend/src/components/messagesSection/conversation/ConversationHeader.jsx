import { useState } from "react";
import useLastActive from "../../../hooks/useLastActive";
import OnlineAvatar from "../../component-items/avatar/OnlineAvatar";
import Button from "../../component-items/button/button";
import ModalBackground from "../../component-items/modal/ModalBackground";
import ParticipantsModal from "../../participantsModal/ParticipantsModal";
import { FiRefreshCw, FiUsers } from "react-icons/fi";
import ConversationActions from "./conversationActions/ConversationActions";
import "./conversation.css";

const ConversationHeader = ({ chatUser, images = {}, onRefresh, onDeleteHistory, canDeleteHistory, isBusy }) => {
  const [showParticipants, setShowParticipants] = useState(false);
  const lastActive = useLastActive(chatUser.lastTimeOnline);
  const status = chatUser.type === "group" ? "Rozmowa grupowa" : chatUser.isOnline ? "Online" : lastActive ?? "Rozmowa prywatna";
  return (
    <div className="conversation-header-wrapper">
      <div className="avatar-info-wrapper">
        <OnlineAvatar size={3} isOnline={chatUser.isOnline} image={chatUser.imageUrl || (chatUser.type === "private" ? images[chatUser.recipientUserId] : null)} />
        <div className="user-info-header-wrapper"><h3>{chatUser.type === "group" ? "Grupa: " : ""}{chatUser.name}</h3><span>{status}</span></div>
      </div>
      <div className="conversation-btn-wrapper">
        {chatUser.participants?.length > 0 && <Button style="popupSettingsButton" Icon={<FiUsers />} onClick={() => setShowParticipants(true)}>Uczestnicy</Button>}
        {chatUser.id && <>
          <Button style="popupSettingsButton" Icon={<FiRefreshCw />} onClick={onRefresh} disabled={isBusy}>Odśwież</Button>
          {canDeleteHistory && <ConversationActions onDelete={onDeleteHistory} disabled={isBusy} />}
        </>}
      </div>
      {showParticipants && <ModalBackground closeModal={() => setShowParticipants(false)}><ParticipantsModal participants={chatUser.participants} /></ModalBackground>}
    </div>
  );
};
export default ConversationHeader;
