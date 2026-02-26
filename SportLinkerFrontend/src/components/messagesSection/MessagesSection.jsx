import { useState } from "react";
import ChatSidebar from "./chatSidebar/ChatSidebar";
import Conversation from "./conversation/Conversation";
import "./messagesSection.css";

const MessagesSection = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [chatPeople, setChatPeople] = useState({
    conversations: [
      {
        id: 1,
        type: "private",
        name: "Maciek",
        isOnline: true,
        lastTimeOnline: "2024-03-22T18:00",
        lastMessage: {
          name: "Kamil",
          text: "Świetnie! Do zobaczenia jutro kolego",
          time: "2027-01-20T18:00",
        },
      },
      {
        id: 2,
        type: "private",
        name: "Martuuusia",
        isOnline: false,
        lastTimeOnline: "2024-03-22T18:00",
        lastMessage: {
          name: "Martuuusia",
          text: "Lovjuuuu",
          time: "2027-03-22T18:00",
        },
      },
      {
        id: 3,
        type: "group",
        name: "Szukam osób do koszykówki",
        isOnline: false,
        lastTimeOnline: "2024-03-22T18:00",
        lastMessage: {
          name: "Robert",
          text: "Co ja robię tuuuu",
          time: "2027-03-22T18:00",
        },
      },
    ],
    friends: [
      {
        id: 2,
        name: "Martuuusia",
        isOnline: false,
        lastTimeOnline: "2024-03-22T18:00",
      },
      {
        id: 3,
        name: "Lolek",
        isOnline: true,
        lastTimeOnline: "2026-03-22T18:00",
      },
      {
        id: 9,
        name: "Piotr Zieliński",
        isOnline: false,
        lastTimeOnline: "2026-02-25T18:00",
      },
    ],
  });

  return (
    <div className="message-section-wrapper">
      <ChatSidebar
        chatPeople={chatPeople}
        onChatSelect={setActiveChat}
        activeChat={activeChat}
      />
      <Conversation chatUser={activeChat} />
    </div>
  );
};

export default MessagesSection;
