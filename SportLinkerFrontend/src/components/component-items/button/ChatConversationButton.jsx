import useDateFormat from "../../../hooks/useDateFormat";
import OnlineAvatar from "../avatar/OnlineAvatar";
import "./chatConversationButton.css";

const ChatConversationButton = ({
  onClick,
  name,
  date,
  text,
  activeChat,
  id,
  isOnline,
}) => {
  const formattedDate = useDateFormat(date);

  return (
    <button
      className={`${
        activeChat?.id === id ? "active-chat-profile-btn" : ""
      } chat-profile-btn`}
      onClick={onClick}
    >
      <div className="chat-profile-wrapper">
        <div className="chat-profile-avatar">
          <OnlineAvatar size={3} isOnline={isOnline} />
        </div>
        <div className="chat-profile-info-wrapper">
          <div className="chat-profile-info">
            <h3>{name}</h3>
            <span>{formattedDate.date}</span>
          </div>
          <p>{text}</p>
        </div>
      </div>
    </button>
  );
};

export default ChatConversationButton;
