import Avatar from "../../../component-items/avatar/Avatar";
import "./conversationTyping.css";

const ConversationTyping = ({ users = [], images = {} }) => {
  if (users.length === 0) return null;

  return (
    <div className="conversation-typing" role="status" aria-live="polite" aria-atomic="true">
      <span className="conversation-typing-label">
        {users.map((user) => `${user.senderName || "Użytkownik"} pisze wiadomość`).join(". ")}
      </span>
      <div className="conversation-typing-people" aria-hidden="true">
        {users.map((user) => (
          <div key={user.userId} className="conversation-typing-person" title={`${user.senderName || "Użytkownik"} pisze…`}>
            <Avatar size={1.75} image={images[user.userId]} />
            <span className="conversation-typing-bubble">
              <i /><i /><i />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationTyping;
