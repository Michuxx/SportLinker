import Avatar from "../../../component-items/avatar/Avatar";
import "./messageReadReceipts.css";

const MessageReadReceipts = ({ readers = [], images = {}, names = {} }) => {
  if (!readers.length) return null;
  const name = (reader) => reader.userName || reader.name || names[reader.userId] || `Użytkownik #${reader.userId}`;
  const description = `Przeczytane przez: ${readers.map(name).join(", ")}`;
  return (
    <div className="message-read-receipts" role="group" aria-label={description} title={description}>
      {readers.slice(0, 5).map((reader) => (
        <div className="message-reader-avatar" key={reader.userId} title={name(reader)}>
          <Avatar size={1.25} image={reader.profileImage || reader.imageUrl || images[reader.userId]} />
        </div>
      ))}
      {readers.length > 5 && <span className="message-read-more">+{readers.length - 5}</span>}
    </div>
  );
};

export default MessageReadReceipts;
