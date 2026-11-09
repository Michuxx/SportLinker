import useDifferenceDates from "../../../hooks/useDifferenceDates";
import OnlineAvatar from "../avatar/OnlineAvatar";
import FriendDropdown from "../dropdown/friendDropdown/FriendDropdown";
import "./chatFriendButton.css";

const ChatFriendButton = ({
  onClick,
  name,
  date,
  isOnline,
  openWarningModal,
  image,
}) => {
  const formattedDate = useDifferenceDates(date);

  const formattedDateText =
    formattedDate !== 0
      ? `Ostatnio aktywny ${formattedDate} dni temu`
      : `Ostatnio dzisiaj online`;

  return (
    <div
      className="chat-friend-btn"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => { if (event.target === event.currentTarget && ["Enter", " "].includes(event.key)) { event.preventDefault(); onClick(); } }}
    >
      <div className="chat-friend-wrapper">
        <div className="chat-friend-avatar">
          <OnlineAvatar size={3} isOnline={isOnline} image={image} />
        </div>
        <div className="chat-friend-info-wrapper">
          <div className="chat-friend-info">
            <h3>{name}</h3>
            <span>{isOnline ? "Online" : date ? formattedDateText : "Znajomy"}</span>
          </div>
        </div>
      </div>
      <FriendDropdown name={name} onRemove={openWarningModal} />
    </div>
  );
};

export default ChatFriendButton;
