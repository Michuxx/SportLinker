import { HubConnectionState } from "@microsoft/signalr";

const retryDelays = [0, 2000, 5000, 10000, 30000];
export const chatRetryDelay = (attempt) => retryDelays[Math.min(attempt, retryDelays.length - 1)];

// One supervisor per authenticated session. Transport reconnections are handled
// by SignalR; failed starts and final/server-initiated closes are retried here.
export const maintainChatConnection = (connection, onStateChanged) => {
  const windowTarget = window;
  const documentTarget = document;
  let disposed = false;
  let starting = false;
  let failures = 0;
  let timer;
  const update = (state, error = null) => {
    if (!disposed) onStateChanged({ state, error,
      connection: state === HubConnectionState.Connected ? connection : null });
  };
  const retry = () => {
    clearTimeout(timer);
    if (!disposed) timer = setTimeout(start, Math.max(1000, chatRetryDelay(failures++)));
  };
  async function start() {
    if (disposed || starting || connection.state !== HubConnectionState.Disconnected) return;
    clearTimeout(timer);
    starting = true;
    update(HubConnectionState.Connecting);
    try {
      await connection.start();
      if (disposed) {
        await connection.stop();
        return;
      }
      failures = 0;
      update(HubConnectionState.Connected);
    } catch (error) {
      update(HubConnectionState.Disconnected, error);
      retry();
    } finally {
      starting = false;
    }
  }
  connection.onreconnecting((error) => update(HubConnectionState.Reconnecting, error));
  connection.onreconnected(() => {
    failures = 0;
    update(HubConnectionState.Connected);
  });
  connection.onclose((error) => {
    update(HubConnectionState.Disconnected, error);
    retry();
  });
  const resume = () => { void start(); };
  const visible = () => { if (documentTarget.visibilityState === "visible") resume(); };
  windowTarget.addEventListener("online", resume);
  windowTarget.addEventListener("focus", resume);
  documentTarget.addEventListener("visibilitychange", visible);
  void start();
  return () => {
    disposed = true;
    clearTimeout(timer);
    windowTarget.removeEventListener("online", resume);
    windowTarget.removeEventListener("focus", resume);
    documentTarget.removeEventListener("visibilitychange", visible);
    void connection.stop().catch((error) => console.error("SignalR: błąd zamykania połączenia", error));
  };
};
