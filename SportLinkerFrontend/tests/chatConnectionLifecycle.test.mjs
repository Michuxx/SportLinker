import assert from "node:assert/strict";
import { test } from "node:test";
import { chatRetryDelay, maintainChatConnection } from "../src/api/chatConnectionLifecycle.js";

const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
const environment = (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const previous = { window: globalThis.window, document: globalThis.document };
  const events = new Map();
  const target = (prefix) => ({ addEventListener: (name, callback) => events.set(prefix + name, callback), removeEventListener: (name) => events.delete(prefix + name) });
  globalThis.window = target("window:");
  globalThis.document = { ...target("document:"), visibilityState: "visible" };
  t.after(() => {
    for (const key of ["window", "document"]) {
      if (previous[key] === undefined) delete globalThis[key]; else globalThis[key] = previous[key];
    }
  });
  return events;
};
const createConnection = () => {
  const handlers = {};
  const connection = {
    state: "Disconnected", starts: 0,
    onclose: (callback) => { handlers.close = callback; },
    onreconnecting: (callback) => { handlers.reconnecting = callback; },
    onreconnected: (callback) => { handlers.reconnected = callback; },
    async start() { connection.starts++; connection.state = "Connected"; },
    async stop() { connection.state = "Disconnected"; handlers.close?.(); },
  };
  return { connection, handlers };
};

test("transport retry policy continues beyond four attempts with a capped delay", () => {
  assert.equal(chatRetryDelay(0), 0);
  assert.equal(chatRetryDelay(4), 30000);
  assert.equal(chatRetryDelay(100), 30000);
});

test("initial connection failures keep retrying and recover without remounting the chat", async (t) => {
  environment(t);
  const { connection } = createConnection();
  const states = [];
  connection.start = async () => {
    connection.starts++;
    if (connection.starts < 7) throw new Error("Backend unavailable");
    connection.state = "Connected";
  };
  const stop = maintainChatConnection(connection, (value) => states.push(value));
  t.after(stop);
  await flush();
  for (let i = 0; i < 6; i++) { t.mock.timers.tick(30000); await flush(); }
  assert.equal(connection.starts, 7);
  assert.equal(states.at(-1).state, "Connected");
  assert.equal(states.at(-1).connection, connection);
});

test("a final/server close reconnects; focus and online events never start parallel connections", async (t) => {
  const events = environment(t);
  const { connection, handlers } = createConnection();
  const states = [];
  const stop = maintainChatConnection(connection, (value) => states.push(value.state));
  t.after(stop);
  await flush();
  connection.state = "Disconnected";
  handlers.close(new Error("Server closed connection"));
  events.get("window:online")();
  events.get("window:focus")();
  events.get("document:visibilitychange")();
  await flush();
  t.mock.timers.tick(30000);
  await flush();
  assert.equal(connection.starts, 2);
  assert.equal(states.at(-1), "Connected");
  connection.state = "Reconnecting";
  handlers.reconnecting();
  events.get("window:focus")();
  await flush();
  assert.equal(connection.starts, 2);
  connection.state = "Connected";
  handlers.reconnected();
  assert.equal(states.at(-1), "Connected");
});

test("logout/unmount cancels pending retries and late connection completions", async (t) => {
  const events = environment(t);
  const { connection } = createConnection();
  let finish;
  connection.start = async () => { connection.starts++; await new Promise((resolve) => { finish = resolve; }); connection.state = "Connected"; };
  const states = [];
  const stop = maintainChatConnection(connection, (value) => states.push(value.state));
  stop();
  finish();
  await flush();
  t.mock.timers.tick(120000);
  await flush();
  assert.equal(events.size, 0);
  assert.equal(connection.starts, 1);
  assert.equal(connection.state, "Disconnected");
  assert.equal(states.includes("Connected"), false);
});
