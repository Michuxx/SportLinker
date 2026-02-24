import { useOutletContext } from "react-router";
import "./conversationSidebar.css";
import ChatProfileButton from "../../../component-items/button/ChatProfileButton";

const ConversationSidebar = () => {
  const { chatPeople, onChatSelect } = useOutletContext();
  return (
    <div className="conversation-sidebar-wrapper">
      {chatPeople.conversations.map((conversation) => (
        <ChatProfileButton
          name={conversation.name}
          date={conversation.lastMessage.time}
          text={`${conversation.lastMessage.name}: ${conversation.lastMessage.text}`}
        />
      ))}
    </div>
  );
};

export default ConversationSidebar;
