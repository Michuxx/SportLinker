import { createContext, useEffect, useMemo, useState } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import useAuth from "../hooks/useAuth";
import { createChatConnection } from "../api/chatConnection";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated, isInitialized } = useAuth();

  const [connection, setConnection] = useState(null);
  const [connectionState, setConnectionState] = useState(
    HubConnectionState.Disconnected,
  );
  const [connectionError, setConnectionError] = useState(null);

  const userId = user?.id;

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

    chatConnection.onreconnecting((error) => {
      if (disposed) return;

      setConnectionState(HubConnectionState.Reconnecting);
      setConnectionError(error ?? null);
    });

    chatConnection.onreconnected(() => {
      if (disposed) return;

      setConnectionState(HubConnectionState.Connected);
      setConnectionError(null);
    });

    chatConnection.onclose((error) => {
      if (disposed) return;

      setConnection(null);
      setConnectionState(HubConnectionState.Disconnected);
      setConnectionError(error ?? null);
    });

    const startConnection = async () => {
      try {
        await chatConnection.start();

        if (disposed) {
          await chatConnection.stop();
          return;
        }

        setConnection(chatConnection);
        setConnectionState(HubConnectionState.Connected);

        console.info("SignalR: połączono");
      } catch (error) {
        if (disposed) return;

        setConnection(null);
        setConnectionState(HubConnectionState.Disconnected);
        setConnectionError(error);

        console.error("SignalR: błąd połączenia", error);
      }
    };

    void startConnection();

    return () => {
      disposed = true;

      void chatConnection.stop().catch((error) => {
        console.error("SignalR: błąd zamykania połączenia", error);
      });
    };
  }, [isInitialized, isAuthenticated, userId]);

  const value = useMemo(
    () => ({
      connection,
      connectionState,
      connectionError,
      isConnected: connectionState === HubConnectionState.Connected,
    }),
    [connection, connectionState, connectionError],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
