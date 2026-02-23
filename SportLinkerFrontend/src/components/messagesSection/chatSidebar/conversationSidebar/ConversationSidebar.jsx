import { useOutletContext } from "react-router";
import "./conversationSidebar.css";

const ConversationSidebar = () => {
  const { chatPeople, onChatSelect } = useOutletContext();
  return <div className="conversation-sidebar-wrapper"></div>;
};

export default ConversationSidebar;
