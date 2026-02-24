import { useOutletContext } from "react-router";
import "./conversationSidebar.css";
import ChatProfileButton from "../../../component-items/button/ChatProfileButton";

const ConversationSidebar = () => {
  const { chatPeople, onChatSelect, activeChatId } = useOutletContext();
  return (
    <div className="conversation-sidebar-wrapper">
      {chatPeople.conversations.map((conversation) => (
        <ChatProfileButton
          key={conversation.id}
          id={conversation.id}
          activeChatId={activeChatId}
          name={conversation.name}
          date={conversation.lastMessage.time}
          text={`${conversation.lastMessage.name}: ${conversation.lastMessage.text}`}
          onClick={() => onChatSelect(conversation.id)}
        />
      ))}
    </div>
  );
};

export default ConversationSidebar;
