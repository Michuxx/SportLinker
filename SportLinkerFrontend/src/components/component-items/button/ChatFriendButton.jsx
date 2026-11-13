import useLastActive from "../../../hooks/useLastActive";
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
  const lastActive = useLastActive(date);

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
            <span>{isOnline ? "Online" : lastActive ?? "Znajomy"}</span>
          </div>
        </div>
      </div>
      <FriendDropdown name={name} onRemove={openWarningModal} />
    </div>
  );
};

export default ChatFriendButton;
