import { useEffect } from "react";
import { compareMessagePositions, isMessageInReadPeriod, persistedMessage } from "../utils/conversationReads";

// Observe the bottom of each bubble, including long messages. Merely receiving
// a SignalR event or selecting an unfocused tab must not mark messages as read.
const useVisibleMessages = (containerRef, messages, enabled, onRead, readStates, userId) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled || !onRead) return;
    let timer;
    const check = () => {
      if (document.visibilityState !== "visible" || !document.hasFocus()) return;
      const bounds = container.getBoundingClientRect();
      if (!bounds.height) return;
      const byId = new Map(messages.filter(persistedMessage).map((message) => [String(message.id), message]));
      const latest = new Map();
      for (const marker of container.querySelectorAll("[data-read-message-id]")) {
        const rect = marker.getBoundingClientRect();
        const message = byId.get(marker.dataset.readMessageId);
        if (message && rect.bottom <= Math.min(bounds.bottom, window.innerHeight) &&
            rect.top >= Math.max(bounds.top, 0) && rect.right > 0 && rect.left < window.innerWidth) {
          const periodId = readStates?.find((read) => String(read.userId) === String(userId) &&
            isMessageInReadPeriod(read, message))?.participantId ?? 0;
          const previous = latest.get(periodId);
          if (!previous || compareMessagePositions(message, previous) > 0) latest.set(periodId, message);
        }
      }
      for (const message of latest.values()) void onRead(message);
    };
    const schedule = () => { clearTimeout(timer); timer = setTimeout(check, 250); };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(container);
    container.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    window.addEventListener("focus", schedule);
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      clearTimeout(timer);
      observer?.disconnect();
      container.removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", schedule);
      window.removeEventListener("focus", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [containerRef, messages, enabled, onRead, readStates, userId]);
};

export default useVisibleMessages;
