import { useOutletContext } from "react-router";
import "./conversationSidebar.css";
import ChatConversationButton from "../../../component-items/button/ChatConversationButton";

const ConversationSidebar = () => {
  const { chatPeople, onChatSelect, activeChat } = useOutletContext();
  return (
    <div className="conversation-sidebar-wrapper">
      {chatPeople.conversations.map((conversation) => (
        <ChatConversationButton
          key={conversation.id}
          id={conversation.id}
          activeChat={activeChat}
          name={conversation.name}
          date={conversation.lastMessage.time}
          text={`${conversation.lastMessage.name}: ${conversation.lastMessage.text}`}
          onClick={() =>
            onChatSelect({
              id: conversation.id,
              name: conversation.name,
              type: conversation.type,
              isOnline: conversation.isOnline,
              lastTimeOnline: conversation.lastTimeOnline,
            })
          }
          isOnline={conversation.isOnline}
        />
      ))}
    </div>
  );
};

export default ConversationSidebar;
