import Avatar from "../../../component-items/avatar/Avatar";
import "./message.css";

const Message = ({ message }) => {
  return (
    <div
      className={`message-wrapper ${message.isOwnMessage ? "own-message" : ""}`}
    >
      <div className="avatar-message-wrapper">
        <Avatar size={2} />
      </div>
      <div className="message-info-wrapper">
        <p>{message.senderName}</p>
        <div className="message-content">
          <p>{message.text}</p>
          <div className="message-date">
            <span>{message.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
