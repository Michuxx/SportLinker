import ChatSidebar from "./chatSidebar/ChatSidebar";
import Conversation from "./conversation/Conversation";
import useAuth from "../../hooks/useAuth";
import useMessaging from "../../hooks/useMessaging";
import NullComponent from "../component-items/nullComponent/NullComponent";
import "./messagesSection.css";

const MessagesSection = () => {
  const { user } = useAuth();
  const messaging = useMessaging(user);
  if (!user?.id) return <NullComponent icon="🔒" title="Zaloguj się" text="Zaloguj się, aby korzystać z wiadomości." />;
  return (
    <div className="message-section-wrapper">
      <ChatSidebar messaging={messaging} />
      <Conversation messaging={messaging} />
    </div>
  );
};

export default MessagesSection;
