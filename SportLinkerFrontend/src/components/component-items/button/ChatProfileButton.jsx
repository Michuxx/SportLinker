import Avatar from "../avatar/Avatar";
import "./chatProfileButton.css";

const ChatProfileButton = ({ onClick, name, date, text }) => {
  return (
    <button className="chat-profile-btn" onClick={onClick}>
      <div className="chat-profile-wrapper">
        <div className="chat-profile-avatar">
          <Avatar size={3.1} />
        </div>
        <div className="chat-profile-info-wrapper">
          <div className="chat-profile-profile-info">
            <h3>{name}</h3>
            <span>{date}</span>
          </div>
          <p>{text}</p>
        </div>
      </div>
    </button>
  );
};

export default ChatProfileButton;
