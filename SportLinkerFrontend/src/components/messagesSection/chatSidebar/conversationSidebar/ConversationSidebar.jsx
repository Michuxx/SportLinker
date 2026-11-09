import { useOutletContext } from "react-router";
import ChatConversationButton from "../../../component-items/button/ChatConversationButton";
import MessagingFeedback from "../../messagingFeedback/MessagingFeedback";

const ConversationSidebar = () => {
  const { chatPeople, selectChat, activeChat, listStatuses, reloadList, search } = useOutletContext();
  const conversations = chatPeople.conversations.filter((chat) => chat.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  if (listStatuses.conversations !== "ready") return <MessagingFeedback loading={listStatuses.conversations === "loading"} onRetry={() => reloadList("conversations")} />;
  return (
    <div className="conversation-sidebar-wrapper">
      {conversations.length === 0 && <p className="chat-empty-text">{search ? "Brak pasujących rozmów." : "Nie masz jeszcze rozmów. Wybierz znajomego, aby napisać."}</p>}
      {conversations.map((conversation) => (
        <ChatConversationButton key={conversation.id} id={conversation.id} activeChat={activeChat} name={conversation.name} image={conversation.imageUrl} date={conversation.lastMessage?.time}
          text={conversation.lastMessage ? `${conversation.lastMessage.name ?? ""}: ${conversation.lastMessage.text}` : "Brak wiadomości"}
          onClick={() => selectChat(conversation)} isOnline={conversation.isOnline} />
      ))}
    </div>
  );
};
export default ConversationSidebar;
