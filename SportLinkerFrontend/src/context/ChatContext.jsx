import {
  createContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { HubConnectionState } from "@microsoft/signalr";
import useAuth from "../hooks/useAuth";
import { createChatConnection } from "../api/chatConnection";
import { maintainChatConnection } from "../api/chatConnectionLifecycle";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated, isInitialized } = useAuth();

  const [connection, setConnection] = useState(null);
  const [connectionState, setConnectionState] = useState(
    HubConnectionState.Disconnected,
  );
  const [connectionError, setConnectionError] = useState(null);

  const userId = user?.id;

  const messageListeners = useRef(new Set());
  const presenceListeners = useRef(new Set());
  const readListeners = useRef(new Set());
  const subscribeReads = useCallback((listener) => {
    readListeners.current.add(listener);
    return () => readListeners.current.delete(listener);
  }, []);

  const subscribePresence = useCallback((listener) => {
    presenceListeners.current.add(listener);

    return () => {
      presenceListeners.current.delete(listener);
    };
  }, []);

  const subscribeMessages = useCallback((listener) => {
    messageListeners.current.add(listener);
    return () => {
      messageListeners.current.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (!isInitialized || !isAuthenticated || !userId) {
      setConnection(null);
      setConnectionState(HubConnectionState.Disconnected);
      setConnectionError(null);
      return;
    }

    const chatConnection = createChatConnection();
    let disposed = false;

    setConnection(null);
    setConnectionError(null);
    setConnectionState(HubConnectionState.Connecting);

    chatConnection.on("MessageReceived", (notification) => {
      if (disposed) return;

      for (const listener of messageListeners.current) {
        try {
          listener(notification);
        } catch (error) {
          console.error("Błąd obsługi MessageReceived:", error);
        }
      }
    });

    chatConnection.on("ConversationRead", (notification) => {
      if (disposed) return;
      for (const listener of readListeners.current) {
        try {
          listener(notification);
        } catch (error) {
          console.error("Błąd obsługi ConversationRead:", error);
        }
      }
    });

    chatConnection.on("UserPresenceChanged", (notification) => {
      if (disposed) return;

      for (const listener of presenceListeners.current) {
        try {
          listener(notification);
        } catch (error) {
          console.error("Błąd obsługi UserPresenceChanged:", error);
        }
      }
    });

    const stopConnection = maintainChatConnection(chatConnection, ({ connection, state, error }) => {
      if (disposed) return;
      setConnection(connection);
      setConnectionState(state);
      setConnectionError(error);
    });

    return () => {
      disposed = true;

      stopConnection();
    };
  }, [isInitialized, isAuthenticated, userId]);

  const value = useMemo(
    () => ({
      connection,
      connectionState,
      connectionError,
      isConnected: connectionState === HubConnectionState.Connected,
      subscribeMessages,
      subscribeReads,
      subscribePresence,
    }),
    [
      connection,
      connectionState,
      connectionError,
      subscribeMessages,
      subscribeReads,
      subscribePresence,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
