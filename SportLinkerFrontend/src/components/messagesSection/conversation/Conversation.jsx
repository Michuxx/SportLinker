import { Fragment, useState } from "react";
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
  return (
    <div className="conversation-wrapper">
      {!activeChat ? <NullConversation /> : <Fragment key={chatKey(activeChat)}>
        <ConversationHeader chatUser={activeChat} images={images} canDeleteHistory={canDeleteHistory} onRefresh={refreshMessages} onDeleteHistory={() => setConfirmHistory(activeChat.id)} isBusy={isSending || isDeleting || thread.loading || thread.loadingOlder} />
        <ConversationContent messages={thread.items} images={images} thread={thread} onRetry={refreshMessages} onLoadOlder={loadOlder} onRetryMessage={retryMessage} isSending={isSending || isDeleting || activeChat.canSendMessages === false} />
        {activeChat.canSendMessages === false ? (
          <p className="chat-readonly-text">Możesz przeglądać historię tej rozmowy. Wysyłanie wiadomości jest niedostępne.</p>
        ) : (
          <ConversationChatBar sendMessage={sendMessage} disabled={isSending || isDeleting || thread.loading || thread.error} />
        )}
      </Fragment>}
      {canDeleteHistory && confirmHistory && activeChat?.id === confirmHistory && <ModalBackground closeModal={() => setConfirmHistory(null)}>
        <WarningModal onCancel={() => setConfirmHistory(null)} onConfirm={deleteHistory} mainIcon={<FaRegTrashAlt size={80} color="#dc2626" />} headline="Usunąć konwersację z Twojej historii?" confirmText="Usuń konwersację" confirmIcon={<FaRegTrashAlt />} />
      </ModalBackground>}
    </div>
  );
};
export default Conversation;
