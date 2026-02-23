import Header from "../headerSection/Header";
import "../../index.css";
import MessagesSection from "../messagesSection/MessagesSection";
const Messages = () => {
  return (
    <div className="messages-container">
      <Header />
      <MessagesSection />
    </div>
  );
};

export default Messages;
