import "./conversation.css";
import Message from "./message/Message";

const ConversationContent = ({ messages }) => {
  return (
    <div className="conversation-content-wrapper">
      {messages.length === 0 ? (
        <div className="null-messages-conversation">
          <h4>Brak wcześniejszej konwersacji</h4>
          <p>Napisz pierwszy</p>
        </div>
      ) : (
        messages.map((message) => <Message message={message} />)
      )}
    </div>
  );
};

export default ConversationContent;
