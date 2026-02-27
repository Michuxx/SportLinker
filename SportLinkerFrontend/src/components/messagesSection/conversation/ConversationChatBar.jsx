import { useEffect, useRef, useState } from "react";
import Button from "../../component-items/button/button";
import Input from "../../component-items/input/Input";
import "./conversation.css";
import { BiSolidSend } from "react-icons/bi";

const ConversationChatBar = ({ sendMessage }) => {
  const [messageText, setMessageText] = useState("");

  const inputRef = useRef(null);

  const handleSend = () => {
    if (messageText.trim() !== "") {
      sendMessage(messageText);
      setMessageText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === "Enter" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  return (
    <div className="conversation-chat-bar-wrapper">
      <div className="input-chat-wrapper">
        <Input
          ref={inputRef}
          width={100}
          className="chat-input"
          placeholder="Napisz wiadomość..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="send-message-btn-wrapper">
        <Button
          Icon={<BiSolidSend size={24} />}
          style="sendMessageButton"
          onClick={handleSend}
        />
      </div>
    </div>
  );
};

export default ConversationChatBar;
