import OnlineAvatar from "../../component-items/avatar/OnlineAvatar";
import "./conversation.css";

const ConversationHeader = ({ chatUser }) => {
  return (
    <div className="conversation-header-wrapper">
      <OnlineAvatar size={2} isOnline={chatUser.isOnline} />
      <div className="user-info-wrapper">
        <h3>{chatUser.name}</h3>
        {chatUser.lastActivityText}
      </div>
    </div>
  );
};

export default ConversationHeader;
