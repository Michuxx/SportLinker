import { useState } from "react";
import ChatSidebar from "./chatSidebar/ChatSidebar";
import Conversation from "./conversation/Conversation";
import "./messagesSection.css";

const MessagesSection = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [chatPeople, setChatPeople] = useState({
    conversations: [
      {
        id: 2,
        type: "private",
        name: "Jacuś",
        isOnline: true,
        participants: [
          {
            id: 13,
            name: "Jacuś",
            isOnline: true,
            lastTimeOnline: "2024-03-22T18:00",
          },
          {
            id: 19,
            name: "Kamil",
            isOnline: true,
            lastTimeOnline: "2024-03-22T18:00",
          },
        ],
        lastMessage: {
          name: "Martuuusia",
          text: "Lovjuuuu",
          time: "2027-03-22T18:00",
        },
      },
      {
        id: 3,
        type: "private",
        name: "Martuuusia",
        isOnline: false,
        participants: [
          {
            id: 1,
            name: "Martuuusia",
            isOnline: false,
            lastTimeOnline: "2024-03-22T18:00",
          },
          {
            id: 19,
            name: "Kamil",
            isOnline: true,
            lastTimeOnline: "2024-03-22T18:00",
          },
        ],
        lastMessage: {
          name: "Martuuusia",
          text: "Lovjuuuu",
          time: "2027-03-22T18:00",
        },
      },
      {
        id: 7,
        type: "group",
        name: "Szukam osób do gry",
        isOnline: null,
        participants: [
          {
            id: 1,
            name: "Martuuusia",
            isOnline: false,
            lastTimeOnline: "2024-03-22T18:00",
          },
          {
            id: 90,
            name: "Jacuś",
            isOnline: true,
            lastTimeOnline: "2024-03-22T18:00",
          },
          {
            id: 199,
            name: "Adam",
            isOnline: true,
            lastTimeOnline: "2024-03-22T18:00",
          },
          {
            id: 19,
            name: "Kamil",
            isOnline: true,
            lastTimeOnline: "2024-03-22T18:00",
          },
        ],
        lastMessage: {
          name: "Martuuusia",
          text: "Lovjuuuu",
          time: "2027-03-22T18:00",
        },
      },
    ],
    friends: [
      {
        id: 2,
        userId: 1,
        name: "Martuuusia",
        isOnline: false,
        lastTimeOnline: "2024-03-22T18:00",
      },
      {
        id: 3,
        userId: 86,
        name: "Lolek",
        isOnline: true,
        lastTimeOnline: "2026-03-22T18:00",
      },
      {
        id: 9,
        userId: 45,
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
