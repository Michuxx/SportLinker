import { useState } from "react";
import "./conversation.css";
import NullConversation from "./NullConversation";
import ConversationHeader from "./ConversationHeader";
import ConversationContent from "./ConversationContent";
import ConversationChatBar from "./ConversationChatBar";

const Conversation = ({ chatUser }) => {
  const [messages, setMessages] = useState([
    {
      id: "msg_1", // Unikalne ID (niezbędne dla atrybutu "key" przy mapowaniu w React)
      senderName: "Jan Kowalski",
      text: "Cześć! Powiedz mi, jak działa to middleware?",
      timestamp: "2026-02-26T10:15:00.000Z", // Format ISO jest najłatwiejszy do parsowania
      isOwnMessage: false,
    },
    {
      id: "msg_2",
      senderName: "Kamil",
      text: "Cześć, Jan! Middleware to warstwy, przez które przechodzi żądanie HTTP, zanim dotrze do endpointu.",
      timestamp: "2026-02-26T10:16:30.000Z",
      isOwnMessage: true,
    },
    {
      id: "msg_3",
      senderName: "Jan Kowalski",
      text: "A jak to wygląda w .NETcie?",
      timestamp: "2026-02-26T10:17:48.000Z",
      isOwnMessage: false,
    },
    {
      id: "msg_1", // Unikalne ID (niezbędne dla atrybutu "key" przy mapowaniu w React)
      senderName: "Jan Kowalski",
      text: "Cześć! Powiedz mi, jak działa to middleware?",
      timestamp: "2026-02-26T10:15:00.000Z", // Format ISO jest najłatwiejszy do parsowania
      isOwnMessage: false,
    },
    {
      id: "msg_2",
      senderName: "Kamil",
      text: "Cześć, Jan! Middleware to warstwy, przez które przechodzi żądanie HTTP, zanim dotrze do endpointu.",
      timestamp: "2026-02-26T10:16:30.000Z",
      isOwnMessage: true,
    },
    {
      id: "msg_3",
      senderName: "Jan Kowalski",
      text: "A jak to wygląda w .NETcie?",
      timestamp: "2026-02-26T10:17:48.000Z",
      isOwnMessage: false,
    },
    {
      id: "msg_1", // Unikalne ID (niezbędne dla atrybutu "key" przy mapowaniu w React)
      senderName: "Jan Kowalski",
      text: "Cześć! Powiedz mi, jak działa to middleware?",
      timestamp: "2026-02-26T10:15:00.000Z", // Format ISO jest najłatwiejszy do parsowania
      isOwnMessage: false,
    },
    {
      id: "msg_2",
      senderName: "Kamil",
      text: "Cześć, Jan! Middleware to warstwy, przez które przechodzi żądanie HTTP, zanim dotrze do endpointu.",
      timestamp: "2026-02-26T10:16:30.000Z",
      isOwnMessage: true,
    },
    {
      id: "msg_3",
      senderName: "Jan Kowalski",
      text: "A jak to wygląda w .NETcie?",
      timestamp: "2026-02-26T10:17:48.000Z",
      isOwnMessage: false,
    },
  ]);
  return (
    <div className="conversation-wrapper">
      {!chatUser?.id ? (
        <NullConversation />
      ) : (
        <>
          <ConversationHeader chatUser={chatUser} />
          <ConversationContent messages={messages} />
          <ConversationChatBar />
        </>
      )}
    </div>
  );
};

export default Conversation;
