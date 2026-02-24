import useDateFormat from "../../../hooks/useDateFormat";
import Avatar from "../avatar/Avatar";
import OnlineDot from "../avatar/OnlineDot";
import "./chatProfileButton.css";

const ChatProfileButton = ({
  onClick,
  name,
  date,
  text,
  activeChatId,
  id,
  isOnline,
}) => {
  const formattedDate = useDateFormat(date);

  return (
    <button
      className={`${
        activeChatId === id ? "active-chat-profile-btn" : ""
      } chat-profile-btn`}
      onClick={onClick}
    >
      <div className="chat-profile-wrapper">
        <div className="chat-profile-avatar">
          <Avatar size={3} />
        </div>
        <div className="chat-profile-info-wrapper">
          <div className="chat-profile-info">
            <h3>{name}</h3>
            <span>{formattedDate.date}</span>
          </div>
          <p>{text}</p>
        </div>
      </div>
      {isOnline && <OnlineDot />}
    </button>
  );
};

export default ChatProfileButton;
