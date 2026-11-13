import "./conversation.css";
import Message from "./message/Message";
import { useLayoutEffect, useRef } from "react";
import MessagingFeedback from "../messagingFeedback/MessagingFeedback";

const ConversationContent = ({
  messages,
  images = {},
  thread,
  onRetry,
  onLoadOlder,
  onRetryMessage,
  isSending,
}) => {
  const containerRef = useRef(null);
  const previous = useRef({ first: null, last: null, height: 0, count: 0 });
  const previousScrollTop = useRef(0);
  const loadingOlder = useRef(false);

  const loadOlder = async () => {
    if (
      loadingOlder.current ||
      thread.loadingOlder ||
      thread.loading ||
      !thread.hasMore ||
      !thread.cursor
    )
      return;
    loadingOlder.current = true;
    // Capture the current height, including any images that have finished loading.
    previous.current.height =
      containerRef.current?.scrollHeight ?? previous.current.height;
    try {
      await onLoadOlder();
    } finally {
      loadingOlder.current = false;
    }
  };

  const handleScroll = (event) => {
    const container = event.currentTarget;
    const movingUp = container.scrollTop < previousScrollTop.current;
    previousScrollTop.current = container.scrollTop;
    if (
      movingUp &&
      container.scrollTop <= 80 &&
      !thread.error &&
      !thread.olderError
    )
      loadOlder();
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const first = messages[0]?.id;
    const last = messages.at(-1)?.id;
    if (
      previous.current.count &&
      first !== previous.current.first &&
      last === previous.current.last
    ) {
      container.scrollTop += container.scrollHeight - previous.current.height;
    } else if (last !== previous.current.last)
      container.scrollTop = container.scrollHeight;
    previousScrollTop.current = container.scrollTop;
    previous.current = {
      first,
      last,
      height: container.scrollHeight,
      count: messages.length,
    };
  }, [messages]);
  return (
    <div
      className="conversation-content-wrapper"
      ref={containerRef}
      onScroll={handleScroll}
      aria-label="Wiadomości"
    >
      {thread.loading && <MessagingFeedback loading />}
      {thread.error && <MessagingFeedback onRetry={onRetry} />}
      {thread.hasMore && (
        <div className="conversation-history-status">
          {thread.loadingOlder && (
            <span role="status">Ładowanie starszych wiadomości...</span>
          )}
          {thread.olderError && (
            <div role="alert">
              Nie udało się pobrać wiadomości.{" "}
              <button
                type="button"
                className="chat-load-older"
                onClick={loadOlder}
              >
                Spróbuj ponownie
              </button>
            </div>
          )}
        </div>
      )}
      {!thread.loading && !thread.error && messages.length === 0 && (
        <div className="null-messages-conversation">
          <h4>Brak wcześniejszej konwersacji</h4>
          <p>Napisz pierwszy</p>
        </div>
      )}
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          image={message.senderImageUrl || images[message.senderId]}
          onRetry={() => onRetryMessage(message)}
          disabled={isSending}
        />
      ))}
    </div>
  );
};
export default ConversationContent;
