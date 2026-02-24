import useDateFormat from "../../../hooks/useDateFormat";
import Avatar from "../avatar/Avatar";
import OnlineDot from "../avatar/OnlineDot";
import "./chatFriendButton.css";

const ChatFriendButton = ({ onClick, name, date, isOnline }) => {
  const formattedDate = useDateFormat(date);

  return (
    <button className="chat-friend-btn" onClick={onClick}>
      <div className="chat-friend-wrapper">
        <div className="chat-friend-avatar">
          <Avatar size={3} />
        </div>
        <div className="chat-friend-info-wrapper">
          <div className="chat-friend-info">
            <h3>{name}</h3>
            <span>
              {isOnline ? `Online` : `Ostatnio: ${formattedDate.date} dni temu`}
            </span>
          </div>
        </div>
      </div>
      {isOnline && <OnlineDot />}
    </button>
  );
};

export default ChatFriendButton;
