import useDifferenceDates from "../../../hooks/useDifferenceDates";
import OnlineAvatar from "../../component-items/avatar/OnlineAvatar";
import "./conversation.css";

const ConversationHeader = ({ chatUser }) => {
  const formattedDate = useDifferenceDates(chatUser.lastTimeOnline);

  const formattedDateText =
    formattedDate !== 0
      ? `Ostatnio aktywny ${formattedDate} dni temu`
      : `Ostatnio dzisiaj online`;

  return (
    <div className="conversation-header-wrapper">
      <OnlineAvatar size={3} isOnline={chatUser.isOnline} />
      <div className="user-info-wrapper">
        <h3>{chatUser.name}</h3>
        <span>{chatUser.isOnline ? "Online" : formattedDateText}</span>
      </div>
    </div>
  );
};

export default ConversationHeader;
