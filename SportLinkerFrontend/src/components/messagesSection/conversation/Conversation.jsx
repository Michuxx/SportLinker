import { useState } from "react";
import "./conversation.css";
import NullConversation from "./NullConversation";
import ConversationHeader from "./ConversationHeader";

const Conversation = ({ chatId }) => {
  const [messages, setMessages] = useState([
    {
      id: "msg_1", // Unikalne ID (niezbędne dla atrybutu "key" przy mapowaniu w React)
      senderName: "Jan Kowalski",
      text: "Cześć! Powiedz mi, jak działa to middleware?",
      timestamp: "2026-02-26T10:15:00.000Z", // Format ISO jest najłatwiejszy do parsowania
      isOwnMessage: true,
    },
    {
      id: "msg_2",
      senderName: "Kamil",
      text: "Cześć, Jan! Middleware to warstwy, przez które przechodzi żądanie HTTP, zanim dotrze do endpointu.",
      timestamp: "2026-02-26T10:16:30.000Z",
      isOwnMessage: false,
    },
    {
      id: "msg_3",
      senderName: "Jan Kowalski",
      text: "A jak to wygląda w .NETcie?",
      timestamp: "2026-02-26T10:17:48.000Z",
      isOwnMessage: true,
    },
  ]);
  return (
    <div className="conversation-wrapper">
      {!chatId ? (
        <NullConversation />
      ) : (
        <>
          <ConversationHeader />
        </>
      )}
    </div>
  );
};

export default Conversation;
