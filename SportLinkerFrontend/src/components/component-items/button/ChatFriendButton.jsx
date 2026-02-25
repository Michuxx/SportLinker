import useDifferenceDates from "../../../hooks/useDifferenceDates";
import Avatar from "../avatar/Avatar";
import OnlineDot from "../avatar/OnlineDot";
import "./chatFriendButton.css";

const ChatFriendButton = ({ onClick, name, date, isOnline }) => {
  const formattedDate = useDifferenceDates(date);

  const formattedDateText =
    formattedDate !== 0
      ? `Ostatnio ${formattedDate} dni temu`
      : `Ostatnio dzisiaj online`;

  return (
    <button className="chat-friend-btn" onClick={onClick}>
      <div className="chat-friend-wrapper">
        <div className="chat-friend-avatar">
          <Avatar size={3} />
        </div>
        <div className="chat-friend-info-wrapper">
          <div className="chat-friend-info">
            <h3>{name}</h3>
            <span>{isOnline ? `Online` : formattedDateText}</span>
          </div>
        </div>
      </div>
      {isOnline && <OnlineDot />}
    </button>
  );
};

export default ChatFriendButton;
