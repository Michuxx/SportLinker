import "./conversation.css";

import { FiMessageCircle } from "react-icons/fi";

const NullConversation = () => {
  return (
    <div className="null-conversation-wrapper">
      <FiMessageCircle size={76} />
      <span>Wybierz konwersację</span>
      <p>Kliknij na konwersację, aby rozpocząć czat</p>
    </div>
  );
};

export default NullConversation;
