import { useState } from "react";
import Button from "../../component-items/button/button";
import Input from "../../component-items/input/Input";
import { BiSolidSend } from "react-icons/bi";
import "./conversation.css";

const ConversationChatBar = ({ sendMessage, disabled = false }) => {
  const [messageText, setMessageText] = useState("");
  const handleSend = () => {
    if (disabled || !messageText.trim()) return;
    sendMessage(messageText);
    setMessageText("");
  };
  return (
    <div className="conversation-chat-bar-wrapper">
      <div className="input-chat-wrapper">
        <Input width={100} className="chat-input" placeholder="Napisz wiadomość..." aria-label="Treść wiadomości" value={messageText} disabled={disabled} onChange={(event) => setMessageText(event.target.value)} onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); handleSend(); }
        }} />
      </div>
      <div className="send-message-btn-wrapper"><Button Icon={<BiSolidSend size={24} />} style="sendMessageButton" onClick={handleSend} disabled={disabled || !messageText.trim()}>Wyślij</Button></div>
    </div>
  );
};
export default ConversationChatBar;
