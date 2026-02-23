import ChatSidebar from "./chatSidebar/ChatSidebar";
import Conversation from "./conversation/Conversation";
import "./messagesSection.css";

const MessagesSection = () => {
  return (
    <div className="message-section-wrapper">
      <ChatSidebar />
      <Conversation />
    </div>
  );
};

export default MessagesSection;
