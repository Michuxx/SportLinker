import useDifferenceDates from "../../../hooks/useDifferenceDates";
import OnlineAvatar from "../avatar/OnlineAvatar";
import "./chatFriendButton.css";

const ChatFriendButton = ({ onClick, name, date, isOnline }) => {
  const formattedDate = useDifferenceDates(date);

  const formattedDateText =
    formattedDate !== 0
      ? `Ostatnio aktywny ${formattedDate} dni temu`
      : `Ostatnio dzisiaj online`;

  return (
    <button className="chat-friend-btn" onClick={onClick}>
      <div className="chat-friend-wrapper">
        <div className="chat-friend-avatar">
          <OnlineAvatar size={3} isOnline={isOnline} />
        </div>
        <div className="chat-friend-info-wrapper">
          <div className="chat-friend-info">
            <h3>{name}</h3>
            <span>{isOnline ? `Online` : formattedDateText}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ChatFriendButton;
