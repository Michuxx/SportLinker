import "./conversation.css";
import Message from "./message/Message";
import { useLayoutEffect, useRef } from "react";
import MessagingFeedback from "../messagingFeedback/MessagingFeedback";

const ConversationContent = ({ messages, thread, onRetry, onLoadOlder, onRetryMessage, isSending }) => {
  const containerRef = useRef(null);
  const previous = useRef({ first: null, last: null, height: 0, count: 0 });
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const first = messages[0]?.id;
    const last = messages.at(-1)?.id;
    if (previous.current.count && first !== previous.current.first && last === previous.current.last) {
      container.scrollTop += container.scrollHeight - previous.current.height;
    } else if (last !== previous.current.last) container.scrollTop = container.scrollHeight;
    previous.current = { first, last, height: container.scrollHeight, count: messages.length };
  }, [messages]);
  return (
    <div className="conversation-content-wrapper" ref={containerRef} aria-label="Wiadomości">
      {thread.loading && <MessagingFeedback loading />}
      {thread.error && <MessagingFeedback onRetry={onRetry} />}
      {thread.hasMore && <button type="button" className="chat-load-older" disabled={thread.loadingOlder} onClick={onLoadOlder}>{thread.loadingOlder ? "Ładowanie..." : thread.olderError ? "Spróbuj ponownie pobrać starsze wiadomości" : "Pokaż starsze wiadomości"}</button>}
      {!thread.loading && !thread.error && messages.length === 0 && <div className="null-messages-conversation"><h4>Brak wcześniejszej konwersacji</h4><p>Napisz pierwszy</p></div>}
      {messages.map((message) => <Message key={message.clientMessageId ?? message.id} message={message} onRetry={() => onRetryMessage(message)} disabled={isSending} />)}
    </div>
  );
};
export default ConversationContent;
