import OnlineAvatar from "../../component-items/avatar/OnlineAvatar";
import "./conversation.css";

const ConversationHeader = ({ name, isOnline, lastActivityText }) => {
  return (
    <div className="conversation-header-wrapper">
      <OnlineAvatar size={2} isOnline={isOnline} />
      <div className="user-info-wrapper">
        <h3>{name}</h3>
        {lastActivityText}
      </div>
    </div>
  );
};

export default ConversationHeader;
