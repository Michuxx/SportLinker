import { useState } from "react";
import Button from "../../component-items/button/button";
import Input from "../../component-items/input/Input";
import "./conversation.css";
import { BiSolidSend } from "react-icons/bi";

const ConversationChatBar = ({ sendMessage }) => {
  const [messageText, setMessageText] = useState("");

  return (
    <div className="conversation-chat-bar-wrapper">
      <div className="input-chat-wrapper">
        <Input
          width={100}
          className="chat-input"
          placeholder="Napisz wiadomość..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
      </div>
      <div className="send-message-btn-wrapper">
        <Button
          Icon={<BiSolidSend size={24} />}
          style="sendMessageButton"
          onClick={() => {
            sendMessage(messageText);
            setMessageText("");
          }}
        />
      </div>
    </div>
  );
};

export default ConversationChatBar;
