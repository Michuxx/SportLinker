import { useOutletContext } from "react-router";
import "./conversationSidebar.css";
import ChatConversationButton from "../../../component-items/button/ChatConversationButton";
const ConversationSidebar = () => {
  const { chatPeople, onChatSelect, activeChatId } = useOutletContext();
  return (
    <div className="conversation-sidebar-wrapper">
      {chatPeople.conversations.map((conversation) => (
        <ChatConversationButton
          key={conversation.id}
          id={conversation.id}
          activeChatId={activeChatId}
          name={conversation.name}
          date={conversation.lastMessage.time}
          text={`${conversation.lastMessage.name}: ${conversation.lastMessage.text}`}
          onClick={() => onChatSelect(conversation.id)}
          isOnline={conversation.isOnline}
        />
      ))}
    </div>
  );
};

export default ConversationSidebar;
