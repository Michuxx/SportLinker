import useDateFormat from "../../../../hooks/useDateFormat";
import Avatar from "../../../component-items/avatar/Avatar";
import "./message.css";

const Message = ({ message, onRetry, disabled }) => {
  const formattedDate = useDateFormat(message.timestamp);

  return (
    <div
      className={`message-wrapper ${message.isOwnMessage ? "own-message" : ""}`}
    >
      <div className="avatar-message-wrapper">
        <Avatar size={2} />
      </div>
      <div className="message-info-wrapper">
        <p className="message-sender-name">{`${
          message.isOwnMessage ? "Ja" : message.senderName
        }`}</p>
        <div className="message-content">
          <p>{message.text}</p>
          <div className="message-date">
            <span>{`${formattedDate?.date ?? ""} ${formattedDate?.time ?? ""}`}</span>
          </div>
          {message.status === "pending" && <span role="status">Wysyłanie...</span>}
          {message.status === "failed" && <div className="message-send-error" role="alert">Nie wysłano. <button type="button" onClick={onRetry} disabled={disabled}>Ponów</button></div>}
        </div>
      </div>
    </div>
  );
};

export default Message;
