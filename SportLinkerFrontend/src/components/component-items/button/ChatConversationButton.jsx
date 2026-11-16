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
  image,
  unreadCount = 0,
}) => {
  const formattedDate = useDateFormat(date);

  return (
    <button
      className={`${
        activeChat?.id === id ? "active-chat-profile-btn" : ""
      } chat-profile-btn ${unreadCount > 0 ? "unread-chat-profile-btn" : ""}`}
      onClick={onClick}
      aria-label={unreadCount > 0 ? `${name}, nieprzeczytane wiadomości` : name}
    >
      <div className="chat-profile-wrapper">
        <div className="chat-profile-avatar">
          <OnlineAvatar size={3} isOnline={isOnline} image={image} />
        </div>
        <div className="chat-profile-info-wrapper">
          <div className="chat-profile-info">
            <h3>{name}</h3>
            <div className="chat-profile-date">
              <span>{formattedDate?.date}</span>
              {unreadCount > 0 && <span className="chat-unread-dot" aria-hidden="true" />}
            </div>
          </div>
          <p>{text}</p>
        </div>
      </div>
    </button>
  );
};

export default ChatConversationButton;
