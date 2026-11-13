import { Fragment, useState } from "react";
import useConversationTyping from "../../../hooks/useConversationTyping";
import { chatKey } from "../../../utils/messaging";
import "./conversation.css";
import NullConversation from "./NullConversation";
import ConversationHeader from "./ConversationHeader";
import ConversationContent from "./ConversationContent";
import ConversationChatBar from "./ConversationChatBar";
import ModalBackground from "../../component-items/modal/ModalBackground";
import WarningModal from "../../warningModal/WarningModal";
import { FaRegTrashAlt } from "react-icons/fa";

const Conversation = ({ messaging }) => {
  const [confirmHistory, setConfirmHistory] = useState(null);
  const { activeChat, thread, images, canDeleteHistory, isSending, isDeleting, sendMessage, retryMessage, deleteHistory, refreshMessages, loadOlder } = messaging;
  const { typingCount, updateTyping, stopTyping } = useConversationTyping(activeChat);
  return (
    <div className="conversation-wrapper">
      {!activeChat ? <NullConversation /> : <Fragment key={chatKey(activeChat)}>
        <ConversationHeader chatUser={activeChat} images={images} canDeleteHistory={canDeleteHistory} onRefresh={refreshMessages} onDeleteHistory={() => setConfirmHistory(activeChat.id)} isBusy={isSending || isDeleting || thread.loading || thread.loadingOlder} />
        <ConversationContent messages={thread.items} images={images} thread={thread} onRetry={refreshMessages} onLoadOlder={loadOlder} onRetryMessage={retryMessage} isSending={isSending || isDeleting || activeChat.canSendMessages === false} />
        {typingCount > 0 && <div className="chat-typing-indicator" role="status">
          <span className="chat-typing-dots" aria-hidden="true"><i /><i /><i /></span>
          <span>{activeChat.type === "private" ? "Pisze…" : typingCount === 1 ? "Ktoś pisze…" : "Kilka osób pisze…"}</span>
        </div>}
        {activeChat.canSendMessages === false ? (
          <p className="chat-readonly-text">Możesz przeglądać historię tej rozmowy. Wysyłanie wiadomości jest niedostępne.</p>
        ) : (
          <ConversationChatBar sendMessage={sendMessage} onTyping={updateTyping} onStopTyping={stopTyping} disabled={isSending || isDeleting || thread.loading || thread.error} />
        )}
      </Fragment>}
      {canDeleteHistory && confirmHistory && activeChat?.id === confirmHistory && <ModalBackground closeModal={() => setConfirmHistory(null)}>
        <WarningModal onCancel={() => setConfirmHistory(null)} onConfirm={deleteHistory} mainIcon={<FaRegTrashAlt size={80} color="#dc2626" />} headline="Usunąć konwersację z Twojej historii?" confirmText="Usuń konwersację" confirmIcon={<FaRegTrashAlt />} />
      </ModalBackground>}
    </div>
  );
};
export default Conversation;
