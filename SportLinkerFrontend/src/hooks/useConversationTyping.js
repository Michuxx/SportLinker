import { useCallback, useEffect, useReducer, useRef } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import useChat from "./useChat";
import useAuth from "./useAuth";

const reducer = (state, action) => {
  if (action.type === "reset") {
    return {
      conversationId: action.conversationId,
      users: [],
    };
  }

  if (state.conversationId !== action.conversationId) {
    return state;
  }

  if (!action.isTyping) return { ...state, users: state.users.filter((user) => user.userId !== action.userId) };
  const existing = state.users.find((user) => user.userId === action.userId);
  if (existing?.senderName === action.senderName) return state;
  const person = { userId: action.userId, senderName: action.senderName };
  return {
    ...state,
    users: existing
      ? state.users.map((user) => user.userId === action.userId ? person : user)
      : [...state.users, person],
  };
};

// Sygnały wygasają również wtedy, gdy druga przeglądarka utraci połączenie.
const useConversationTyping = (chat) => {
  const { connection, isConnected, subscribeMessages } = useChat();
  const { user } = useAuth();
  const userId = Number(user?.id);
  const conversationId = chat?.id;
  const enabled = Boolean(conversationId && chat?.canSendMessages !== false);
  const [state, dispatch] = useReducer(reducer, {
    conversationId: null,
    users: [],
  });
  const outgoing = useRef(null);

  useEffect(() => {
    dispatch({ type: "reset", conversationId });
    if (!connection || !isConnected || !enabled) return;

    let idleTimer;
    let lastSentAt = 0;
    let sending = false;
    const expiryTimers = new Map();

    const send = (isTyping) => {
      if (connection.state !== HubConnectionState.Connected) return;
      void connection
        .invoke("SetTyping", conversationId, isTyping)
        .catch((error) => {
          console.warn("SignalR: nie udało się przesłać stanu pisania", error);
        });
    };

    const stop = () => {
      clearTimeout(idleTimer);
      if (sending) send(false);
      sending = false;
      lastSentAt = 0;
    };

    const update = (text) => {
      if (!text.trim()) {
        stop();
        return;
      }
      const now = Date.now();
      if (!sending || now - lastSentAt >= 2000) {
        send(true);
        sending = true;
        lastSentAt = now;
      }
      clearTimeout(idleTimer);
      idleTimer = setTimeout(stop, 1500);
    };

    outgoing.current = { update, stop };

    const clearUser = (id) => {
      clearTimeout(expiryTimers.get(id));
      expiryTimers.delete(id);
      dispatch({
        type: "changed",
        conversationId,
        userId: id,
        isTyping: false,
      });
    };

    const receive = (notification) => {
      const id = Number(notification?.userId);
      if (
        notification?.conversationId !== conversationId ||
        id === userId ||
        !Number.isInteger(id) ||
        id <= 0
      )
        return;
      if (notification.isTyping === true) {
        clearTimeout(expiryTimers.get(id));
        dispatch({
          type: "changed",
          conversationId,
          userId: id,
          senderName: notification.senderName || "Użytkownik",
          isTyping: true,
        });
        expiryTimers.set(
          id,
          setTimeout(() => clearUser(id), 4000),
        );
      } else clearUser(id);
    };

    connection.on("TypingChanged", receive);
    const unsubscribe = subscribeMessages((notification) => {
      if (notification.conversationId === conversationId)
        clearUser(Number(notification.message?.senderId));
    });

    return () => {
      stop();
      outgoing.current = null;
      connection.off("TypingChanged", receive);
      unsubscribe();
      for (const timer of expiryTimers.values()) clearTimeout(timer);
    };
  }, [
    connection,
    isConnected,
    conversationId,
    userId,
    enabled,
    subscribeMessages,
  ]);

  const updateTyping = useCallback(
    (text) => outgoing.current?.update(text),
    [],
  );
  const stopTyping = useCallback(() => outgoing.current?.stop(), []);
  const typingUsers =
    enabled && isConnected && state.conversationId === conversationId
      ? state.users
      : [];

  return {
    typingUsers,
    updateTyping,
    stopTyping,
  };
};

export default useConversationTyping;
